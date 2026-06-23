# Brazilian Portuguese (pt-BR) Translation Notes

## Clue Word Decisions

These translations are CRITICAL because they appear in SQL query results and must match across tables (cross-reference consistency).

### Case 001 - The Vanishing Briefcase
| English | Portuguese | Rationale |
|---------|-----------|-----------|
| trench coat | sobretudo | Most natural Brazilian Portuguese term for a long detective-style coat |
| scar on his left cheek | cicatriz na bochecha esquerda | Direct, unambiguous translation |

### Case 002 - The Stolen Sound
| English | Portuguese | Rationale |
|---------|-----------|-----------|
| red bandana | bandana vermelha | "Bandana" is used as-is in Brazilian Portuguese |
| gold watch | relógio de ouro | Standard translation |

### Case 003 - The Miami Marina Murder
| English | Portuguese | Rationale |
|---------|-----------|-----------|
| Ocean Drive | Ocean Drive | Kept as-is - real place name |

### Case 004 - The Midnight Masquerade Murder
| English | Portuguese | Rationale |
|---------|-----------|-----------|
| Carpenter | Carpinteiro | CRITICAL clue word - must match in occupation field and phone record text |
| "I'm gonna kill him!" | "Eu vou matar ele!" | Natural spoken Brazilian Portuguese (not formal "Eu vou matá-lo!") |
| Lamborghini | Lamborghini | Brand name, kept as-is |

### Case 005 - The Silicon Sabotage
| English | Portuguese | Rationale |
|---------|-----------|-----------|
| Lead Engineer | Engenheiro Principal | Common Brazilian tech industry title |
| Helsinki | Helsinki | Geographic name, kept as-is |
| Facility 18 | Instalação 18 | Direct translation |
| QX- (keycard prefix) | QX- | Code/ID prefix, kept as-is |
| QuantaX | QuantaX | Product name, kept as-is |

### Case 006 - The Vanishing Diamond
| English | Portuguese | Rationale |
|---------|-----------|-----------|
| navy suit | terno azul-marinho | Standard Brazilian Portuguese fashion term |
| VIP-R | VIP-R | Code/ID, kept as-is |
| Heart of Atlantis | Coração de Atlântida | Translated for narrative immersion (appears in description only, not queried) |

## General Rules Applied
1. **Character names** - NEVER translated (they are answer keys)
2. **Table and column names** - NEVER translated (players write SQL against them)
3. **Place names** - Real places kept as-is (Ocean Drive, Coconut Grove, Miami)
4. **Dates and IDs** - NEVER translated
5. **Crime types, descriptions, occupations, testimony, attire** - Translated to Portuguese
6. **Brand names** - Kept as-is (Lamborghini, etc.)
