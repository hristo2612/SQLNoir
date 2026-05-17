"use client";

import React, { useCallback } from "react";
import {
  Table2,
  Key,
  Link,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import ReactFlow, {
  Node,
  Edge,
  Position,
  MarkerType,
  Handle,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { db } from "../../services/DatabaseService";
import { useDatabase } from "../../hooks/useDatabase";

interface SchemaInfo {
  tableName: string;
  columns: {
    name: string;
    type: string;
    isPrimary: boolean;
    isForeign: boolean;
  }[];
  foreignKeys: {
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }[];
}

interface DatabaseSchemaProps {
  caseId: string;
}

interface TableNodeProps {
  data: {
    tableName: string;
    columns: {
      name: string;
      type: string;
      isPrimary: boolean;
      isForeign: boolean;
    }[];
  };
}

// Add copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

function TableNode({ data }: TableNodeProps) {
  const t = useTranslations();
  return (
    <div className="bg-amber-100/50 rounded-lg border border-amber-900/10 min-w-[200px]">
      <div className="bg-amber-100 px-4 py-2 flex items-center">
        <Table2 className="w-4 h-4 mr-2 text-amber-900" />
        <span className="font-detective text-amber-900">{data.tableName}</span>
      </div>
      <div className="p-2">
        {data.columns.map((column) => (
          <div
            key={column.name}
            className="flex items-center text-sm py-1 relative"
          >
            <span className="text-amber-900">
              {column.name} ({column.type})
              {column.isPrimary && (
                <Key
                  className="w-3 h-3 text-amber-900 inline ml-1"
                  aria-label={t('caseStudy.primaryKey')}
                />
              )}
              {column.isForeign && (
                <Link
                  className="w-3 h-3 text-amber-700 inline ml-1"
                  aria-label={t('caseStudy.foreignKey')}
                />
              )}
            </span>
            {/* Add handles for primary and foreign keys */}
            {column.isPrimary && (
              <Handle
                type="source"
                position={Position.Right}
                id={`${column.name}-source`}
                style={{ top: "50%", background: "#78350f" }}
              />
            )}
            {column.isForeign && (
              <Handle
                type="target"
                position={Position.Left}
                id={`${column.name}-target`}
                style={{ top: "50%", background: "#78350f" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateNodePosition(
  index: number,
  total: number,
  radius: number = 300
) {
  // For single node, place it in the center
  if (total === 1) {
    return { x: radius, y: radius };
  }

  // Calculate angle for current node (subtract π/2 to start from top)
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;

  // Calculate position using trigonometry
  return {
    x: radius + radius * Math.cos(angle),
    y: radius + radius * Math.sin(angle),
  };
}

export function DatabaseSchemaGraph({ schema }: { schema: SchemaInfo[] }) {
  const t = useTranslations();
  const initialNodes = React.useMemo(() => {
    const nodes: Node[] = [];
    const totalTables = schema.length;

    schema.forEach((table, index) => {
      const position = calculateNodePosition(index, totalTables);
      nodes.push({
        id: table.tableName,
        type: "tableNode",
        position,
        data: table,
      });
    });
    return nodes;
  }, [schema]);

  const initialEdges = React.useMemo(() => {
    const edges: Edge[] = [];
    schema.forEach((table) => {
      table.foreignKeys.forEach((fk) => {
        edges.push({
          id: `${table.tableName}-${fk.fromColumn}-${fk.toTable}`,
          source: fk.toTable,
          target: table.tableName,
          sourceHandle: `${fk.toColumn}-source`,
          targetHandle: `${fk.fromColumn}-target`,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#78350f",
          },
          style: {
            stroke: "#78350f",
            strokeWidth: 2,
            strokeDasharray: "none",
          },
        });
      });
    });
    return edges;
  }, [schema]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => [...eds, params]),
    [setEdges]
  );

  const nodeTypes = React.useMemo(
    () => ({
      tableNode: TableNode,
    }),
    []
  );

  return (
    <div className="space-y-2">
      <div className="h-[600px] border border-amber-900/10 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-amber-50/50"
        >
          <Controls className="text-amber-900" />
          <Background />
        </ReactFlow>
      </div>
      <p className="text-sm text-amber-700 text-center italic">
        {t('caseStudy.schemaTip')}
      </p>
    </div>
  );
}

export function DatabaseSchema({ caseId }: DatabaseSchemaProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [schema, setSchema] = React.useState<SchemaInfo[]>([]);
  const [viewMode, setViewMode] = React.useState<"table" | "graph">("table");
  const [expandedTables, setExpandedTables] = React.useState<Set<string>>(
    new Set()
  );
  const { isLoading, error } = useDatabase(caseId, locale);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableName)) {
        next.delete(tableName);
      } else {
        next.add(tableName);
      }
      return next;
    });
  };

  React.useEffect(() => {
    const fetchSchema = async () => {
      try {
        if (!isLoading && !error) {
          const tableResult = await db.executeQuery(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
          `);

          const schemaInfo: SchemaInfo[] = [];

          for (const [tableName] of tableResult.values) {
            const columnResult = await db.executeQuery(
              `PRAGMA table_info('${tableName}')`
            );
            const foreignKeyResult = await db.executeQuery(
              `PRAGMA foreign_key_list('${tableName}')`
            );

            // Process foreign keys
            const foreignKeys = foreignKeyResult.values.map((row: any[]) => ({
              fromColumn: row[3], // 'from' column name
              toTable: row[2], // referenced table
              toColumn: row[4], // referenced column
            }));

            const foreignColumnNames = new Set(
              foreignKeys.map((fk) => fk.fromColumn)
            );

            const columns = columnResult.values.map((row: any[]) => ({
              name: row[1],
              type: row[2],
              isPrimary: row[5] === 1,
              isForeign: foreignColumnNames.has(row[1]),
            }));

            schemaInfo.push({
              tableName: tableName as string,
              columns,
              foreignKeys,
            });
          }

          setSchema(schemaInfo);
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
      }
    };

    fetchSchema();
  }, [isLoading, error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-amber-700 animate-spin" />
        <span className="ml-2 text-amber-900">{t('caseStudy.loadingSchema')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded">
        <p className="font-bold">{t('caseStudy.failedToLoadSchema')}</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (schema.length === 0) {
    return (
      <div className="bg-amber-100/50 p-6 rounded-lg border border-amber-900/10">
        <p className="text-amber-800">{t('caseStudy.noTablesFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border border-amber-900/10 p-1">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === "table"
                ? "bg-amber-100 text-amber-900"
                : "text-amber-700 hover:bg-amber-50"
            }`}
            onClick={() => setViewMode("table")}
          >
            {t('caseStudy.tableView')}
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === "graph"
                ? "bg-amber-100 text-amber-900"
                : "text-amber-700 hover:bg-amber-50"
            }`}
            onClick={() => setViewMode("graph")}
          >
            {t('caseStudy.graphView')}
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="space-y-6">
          {schema.map((table) => (
            <div
              key={table.tableName}
              className="bg-amber-100/50 rounded-lg overflow-hidden border border-amber-900/10"
            >
              <div className="relative">
                <button
                  onClick={() => toggleTable(table.tableName)}
                  className="w-full bg-amber-100 px-4 py-2 flex items-center justify-between hover:bg-amber-200/50 transition-colors group"
                >
                  <div className="flex items-center">
                    <Table2 className="w-4 h-4 mr-2 text-amber-900" />
                    <span className="font-detective text-amber-900">
                      {table.tableName}
                    </span>
                  </div>
                  {expandedTables.has(table.tableName) ? (
                    <ChevronUp className="w-4 h-4 text-amber-700" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-700" />
                  )}
                </button>
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(table.tableName);
                    }}
                    className={`p-1 rounded-md transition-opacity hover:bg-amber-200 ${
                      expandedTables.has(table.tableName)
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    title={t('caseStudy.copyTableName')}
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
              {expandedTables.has(table.tableName) && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-amber-50">
                        <th className="px-6 py-3 text-left text-xs font-detective text-amber-900">
                          {t('caseStudy.column')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-detective text-amber-900">
                          {t('caseStudy.type')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-detective text-amber-900">
                          {t('caseStudy.key')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-200">
                      {table.columns.map((column) => (
                        <tr key={column.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
                            {column.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-amber-700">
                            {column.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {column.isPrimary && (
                              <Key className="w-4 h-4 text-amber-900" />
                            )}
                            {column.isForeign && (
                              <Link className="w-4 h-4 text-amber-700" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ReactFlowProvider>
          <DatabaseSchemaGraph schema={schema} />
        </ReactFlowProvider>
      )}
    </div>
  );
}
