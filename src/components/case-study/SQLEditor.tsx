import { useRef, useEffect, useState } from "react";
import { db } from "../../services/DatabaseService";
import { useDatabase } from "../../hooks/useDatabase";

// SQL keywords to highlight
const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "GROUP",
  "ORDER",
  "BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "ALTER",
  "DROP",
  "TABLE",
  "INDEX",
  "VIEW",
  "INTO",
  "VALUES",
  "SET",
  "NOT",
  "NULL",
  "DEFAULT",
  "PRIMARY",
  "FOREIGN",
  "KEY",
  "AND",
  "OR",
  "IN",
  "BETWEEN",
  "LIKE",
  "IS",
  "AS",
  "DISTINCT",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "ON",
  "ASC",
  "DESC",
].sort();

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  placeholder?: string;
  caseId: string;
}

interface Token {
  type: "keyword" | "string" | "number" | "comment" | "text";
  value: string;
}

interface SuggestionPosition {
  top: number;
  left: number;
}

interface Suggestion {
  text: string;
  type: "keyword" | "table";
}

export function SQLEditor({
  value,
  onChange,
  onExecute,
  placeholder,
  caseId,
}: SQLEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionPosition, setSuggestionPosition] =
    useState<SuggestionPosition | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const { isInitialized } = useDatabase(caseId);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load saved query from localStorage on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem(`sqlnoir-query-${caseId}`);
    if (savedQuery && value === "") {
      onChange(savedQuery);
    }
  }, [caseId]);

  // Save query to localStorage on change
  useEffect(() => {
    localStorage.setItem(`sqlnoir-query-${caseId}`, value);
  }, [value, caseId]);

  // Fetch table names when database is initialized
  useEffect(() => {
    const fetchTableNames = async () => {
      if (!isInitialized) return;

      try {
        const result = await db.executeQuery(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);
        setTableNames(result.values.map(([name]) => name as string));
      } catch (error) {
        console.error("Error fetching table names:", error);
      }
    };

    fetchTableNames();
  }, [isInitialized]);

  // Handle keyboard shortcuts and suggestions
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Enter or Cmd+Enter
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onExecute();
        return;
      }

      // Handle suggestion navigation
      if (suggestions.length > 0) {
        if (e.key === "Tab" || e.key === "Enter") {
          e.preventDefault();
          if (suggestions[0]) {
            insertSuggestion(suggestions[0]);
          }
        }
      }
    };

    textarea.addEventListener("keydown", handleKeyDown);
    return () => textarea.removeEventListener("keydown", handleKeyDown);
  }, [onExecute, suggestions]);

  // Sync scroll between textarea and highlight div
  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;

    if (!textarea || !highlight) return;

    const handleScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  const getCurrentWordAndPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { word: "", position: null };

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const words = textBeforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1].toUpperCase();

    // Calculate position for suggestion popup
    const textLines = textBeforeCursor.split("\n");
    const currentLine = textLines[textLines.length - 1];
    const lineHeight = 20; // Approximate line height in pixels

    const rect = textarea.getBoundingClientRect();
    const position: SuggestionPosition = {
      top: rect.top + (textLines.length - 1) * lineHeight,
      left: rect.left + currentLine.length * 8, // Approximate character width
    };

    return { word: currentWord, position };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (!isMobile) {
      setSuggestions([]);
      setSuggestionPosition(null);
      return;
    }

    const { word, position } = getCurrentWordAndPosition();

    if (word.length >= 1) {
      // Get keyword matches
      const keywordMatches = SQL_KEYWORDS.filter(
        (keyword) => keyword.startsWith(word) && keyword !== word
      ).map((text) => ({ text, type: "keyword" as const }));

      // Get table name matches
      const tableMatches = tableNames
        .filter(
          (table) =>
            table.toUpperCase().startsWith(word) && table.toUpperCase() !== word
        )
        .map((text) => ({ text, type: "table" as const }));

      // Combine and limit suggestions
      const allSuggestions = [...keywordMatches, ...tableMatches].slice(0, 5);
      setSuggestions(allSuggestions);
      setSuggestionPosition(position);
    } else {
      setSuggestions([]);
      setSuggestionPosition(null);
    }
  };

  const insertSuggestion = (suggestion: Suggestion) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Prevent default button behavior that might cause focus loss
    event?.preventDefault();

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const words = textBeforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1];

    const newValue =
      textBeforeCursor.slice(0, -lastWord.length) +
      suggestion.text +
      textAfterCursor; // Removed space addition

    // Keep track of where cursor should be after the update
    const newCursorPosition =
      cursorPosition - lastWord.length + suggestion.text.length;

    onChange(newValue);
    setSuggestions([]);
    setSuggestionPosition(null);

    // Ensure textarea keeps focus and cursor position is maintained
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  };

  const tokenize = (code: string): Token[] => {
    const tokens: Token[] = [];
    let remaining = code;

    while (remaining.length > 0) {
      // Check for keywords - only match complete words
      const keywordMatch = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (keywordMatch && SQL_KEYWORDS.includes(keywordMatch[0].toUpperCase())) {
        tokens.push({ type: "keyword", value: keywordMatch[0] });
        remaining = remaining.slice(keywordMatch[0].length);
        continue;
      }

      // If we found a word but it's not a keyword, treat it as text
      if (keywordMatch) {
        tokens.push({ type: "text", value: keywordMatch[0] });
        remaining = remaining.slice(keywordMatch[0].length);
        continue;
      }

      // Check for strings
      const stringMatch = remaining.match(/^(['"][^'"]*['"])/);
      if (stringMatch) {
        tokens.push({ type: "string", value: stringMatch[0] });
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // Check for numbers
      const numberMatch = remaining.match(/^(\d+(\.\d+)?)/);
      if (numberMatch) {
        tokens.push({ type: "number", value: numberMatch[0] });
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }

      // Check for comments
      const commentMatch = remaining.match(/^(--[^\n]*)/);
      if (commentMatch) {
        tokens.push({ type: "comment", value: commentMatch[0] });
        remaining = remaining.slice(commentMatch[0].length);
        continue;
      }

      // Take one character as text
      tokens.push({ type: "text", value: remaining[0] });
      remaining = remaining.slice(1);
    }

    return tokens;
  };

  return (
    <div className="relative font-mono text-sm">
      {/* Just added a parent div so that there are no mismatch between the 
          highlighted text and the textarea text.
      */}
      <div className="relative w-full h-48">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-4 overflow-auto whitespace-pre-wrap break-words pointer-events-none text-amber-100"
          aria-hidden="true"
        >
          {value ? (
            tokenize(value).map((token, i) => {
              switch (token.type) {
                case "keyword":
                  return (
                    <span key={i} className="sql-keyword">
                      {token.value}
                    </span>
                  );
                case "string":
                  return (
                    <span key={i} className="sql-string">
                      {token.value}
                    </span>
                  );
                case "number":
                  return (
                    <span key={i} className="sql-number">
                      {token.value}
                    </span>
                  );
                case "comment":
                  return (
                    <span key={i} className="sql-comment">
                      {token.value}
                    </span>
                  );
                default:
                  return <span key={i}>{token.value}</span>;
              }
            })
          ) : (
            <span className="sql-placeholder">{placeholder}</span>
          )}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          spellCheck={false}
          className="p-4 w-full h-48 bg-transparent text-transparent caret-amber-100 resize-none focus:outline-none"
          style={{ caretColor: "#fef3c7" }}
        />
      </div>
      {isMobile && suggestions.length > 0 && suggestionPosition && (
        <div
          className="absolute z-50 bg-amber-800 rounded-lg shadow-lg border border-amber-700 max-w-[200px]"
          style={{
            top: `${Math.max(0, suggestionPosition.top - 150)}px`,
            left: `${Math.min(
              suggestionPosition.left,
              window.innerWidth - 220
            )}px`,
            transform: "translateZ(0)", // Force GPU acceleration
          }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left text-amber-100 hover:bg-amber-700 first:rounded-t-lg last:rounded-b-lg border-b border-amber-700 last:border-0 flex items-center touch-manipulation truncate"
              onMouseDown={(e) => {
                // Prevent focus loss and view shifting
                e.preventDefault();
                insertSuggestion(suggestion);
              }}
            >
              <span className="flex-1 truncate">{suggestion.text}</span>
              <span className="text-xs text-amber-400 ml-2">
                {suggestion.type === "table" ? "table" : "keyword"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
