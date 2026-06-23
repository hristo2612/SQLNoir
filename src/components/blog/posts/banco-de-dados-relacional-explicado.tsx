"use client";

import Link from "next/link";
import {
  ComparisonTable,
  EntityRelationship,
} from "@/components/blog/diagrams";
import { DetectiveTip, QuickQuiz } from "@/components/blog/content";

export default function BancoDeDadosRelacionalExplicadoContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Um banco de dados relacional é uma forma de organizar informação em
        tabelas que se conectam entre si. Cada tabela guarda um tipo de dado -
        suspeitos, depoimentos, provas - e as tabelas se relacionam por meio de
        chaves. É esse modelo de tabelas ligadas que o SQL consulta, e é a base
        de quase todo sistema que você usa no dia a dia.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Navegação rápida
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#o-que-e" className="hover:underline">
              O que é um banco de dados relacional
            </a>
          </li>
          <li>
            •{" "}
            <a href="#tabelas" className="hover:underline">
              Tabelas, linhas e colunas
            </a>
          </li>
          <li>
            •{" "}
            <a href="#chaves" className="hover:underline">
              Chaves primárias e estrangeiras
            </a>
          </li>
          <li>
            •{" "}
            <a href="#relacionamentos" className="hover:underline">
              Tipos de relacionamento: 1:1, 1:N e N:N
            </a>
          </li>
          <li>
            •{" "}
            <a href="#por-que-relacional" className="hover:underline">
              Por que se chama &quot;relacional&quot;
            </a>
          </li>
          <li>
            •{" "}
            <a href="#relacional-vs-nao" className="hover:underline">
              Relacional vs não relacional
            </a>
          </li>
          <li>
            •{" "}
            <a href="#exemplo" className="hover:underline">
              Um exemplo concreto: o banco de um caso
            </a>
          </li>
          <li>
            •{" "}
            <a href="#faq" className="hover:underline">
              Perguntas frequentes
            </a>
          </li>
        </ul>
      </div>

      {/* ─── Seção 1 ─── */}
      <h2
        id="o-que-e"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        O Que É um Banco de Dados Relacional
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Um banco de dados relacional armazena dados em <strong>tabelas</strong>{" "}
        - estruturas parecidas com planilhas, com linhas e colunas. O que torna
        o modelo &quot;relacional&quot; é que essas tabelas não vivem isoladas:
        elas se conectam umas às outras por meio de <strong>chaves</strong>.
        Assim, em vez de repetir a mesma informação em vários lugares, você a
        guarda uma única vez e simplesmente aponta para ela quando precisa.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Pense numa investigação. Você tem uma tabela de suspeitos, uma tabela de
        depoimentos e uma tabela de provas. O depoimento não repete o nome e a
        idade do suspeito - ele apenas guarda o <em>id</em> do suspeito e diz
        &quot;este depoimento pertence ao suspeito 7&quot;. Quando você quer ver
        tudo junto, o SQL segue essa ligação. Esse é o coração do modelo
        relacional.
      </p>

      {/* ─── Seção 2 ─── */}
      <h2
        id="tabelas"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Tabelas, Linhas e Colunas
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Toda tabela tem três elementos básicos. Entender esses três nomes já
        resolve metade da confusão de quem está começando:
      </p>

      <ul className="text-gray-700 space-y-2 mb-6">
        <li>
          • <strong>Tabela:</strong> representa um tipo de coisa. A tabela{" "}
          <code>suspeitos</code> guarda todos os suspeitos.
        </li>
        <li>
          • <strong>Linha (ou registro):</strong> é uma ocorrência específica.
          Uma linha da tabela <code>suspeitos</code> é um suspeito.
        </li>
        <li>
          • <strong>Coluna (ou campo):</strong> é um atributo. As colunas de{" "}
          <code>suspeitos</code> podem ser <code>id</code>, <code>nome</code>,{" "}
          <code>idade</code> e <code>descricao</code>.
        </li>
      </ul>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          A tabela <code>suspeitos</code> na prática:
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">id</th>
                <th className="border border-gray-300 p-2 text-left">nome</th>
                <th className="border border-gray-300 p-2 text-left">idade</th>
                <th className="border border-gray-300 p-2 text-left">cidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">Carla Mendes</td>
                <td className="border border-gray-300 p-2">34</td>
                <td className="border border-gray-300 p-2">São Paulo</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">Rui Albano</td>
                <td className="border border-gray-300 p-2">29</td>
                <td className="border border-gray-300 p-2">Recife</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">3</td>
                <td className="border border-gray-300 p-2">Diná Castro</td>
                <td className="border border-gray-300 p-2">41</td>
                <td className="border border-gray-300 p-2">São Paulo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Cada linha é um suspeito. Cada coluna é uma característica. A coluna{" "}
          <code>id</code> dá a cada linha um número único - e isso vai ser
          importante na próxima seção.
        </p>
      </div>

      {/* ─── Seção 3 ─── */}
      <h2
        id="chaves"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Chaves Primárias e Chaves Estrangeiras
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        As chaves são o que permite as tabelas conversarem. Existem duas que
        você precisa conhecer:
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        A <strong>chave primária</strong> (primary key) é a coluna que
        identifica cada linha de forma única dentro de uma tabela. Na tabela{" "}
        <code>suspeitos</code>, a chave primária é <code>id</code>: nunca vão
        existir dois suspeitos com o mesmo <code>id</code>. É o &quot;RG&quot;
        da linha.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        A <strong>chave estrangeira</strong> (foreign key) é uma coluna numa
        tabela que aponta para a chave primária de outra tabela. A tabela{" "}
        <code>depoimentos</code> tem uma coluna <code>suspeito_id</code> - essa
        coluna é uma chave estrangeira que diz a qual suspeito o depoimento
        pertence. É assim que o depoimento &quot;sabe&quot; de quem ele é, sem
        precisar copiar o nome e a idade do suspeito.
      </p>

      <DetectiveTip variant="clue" title="A ideia central das chaves">
        Guarde cada informação <strong>uma única vez</strong> e use chaves para
        apontar para ela. Se o nome de um suspeito mudar, você corrige em um só
        lugar - e todos os depoimentos ligados a ele continuam corretos
        automaticamente.
      </DetectiveTip>

      {/* CTA Tier 1 */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Cada caso do SQLNoir é, na prática, um banco de dados relacional
        completo: tabelas de suspeitos, depoimentos e provas ligadas por
        chaves. Resolver os{" "}
        <Link
          href="/pt-br/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          casos de detetive
        </Link>{" "}
        é a forma mais rápida de ver chaves primárias e estrangeiras
        funcionando de verdade.
      </p>

      {/* ─── Seção 4 ─── */}
      <h2
        id="relacionamentos"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Tipos de Relacionamento: 1:1, 1:N e N:N
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Quando duas tabelas se conectam, a conexão tem um formato. Existem três
        tipos de relacionamento, e dá para entender cada um com exemplos da
        investigação:
      </p>

      <ComparisonTable
        headers={["Relacionamento", "O que significa", "Exemplo na investigação"]}
        rows={[
          [
            "1:1 (um para um)",
            "Cada linha de A se liga a no máximo uma linha de B",
            "Um suspeito tem um único registro de identidade",
          ],
          [
            "1:N (um para muitos)",
            "Uma linha de A se liga a várias linhas de B",
            "Um suspeito pode ter vários depoimentos",
          ],
          [
            "N:N (muitos para muitos)",
            "Várias linhas de A se ligam a várias linhas de B",
            "Vários suspeitos aparecem em várias cenas de crime",
          ],
        ]}
        caption="Os três tipos de relacionamento entre tabelas"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        O relacionamento mais comum é o <strong>1:N</strong>. Ele aparece o
        tempo todo: um cliente tem muitos pedidos, um autor escreve muitos
        livros, um suspeito presta muitos depoimentos. Já o{" "}
        <strong>N:N</strong> normalmente é resolvido com uma terceira tabela no
        meio (uma &quot;tabela de junção&quot;) que registra cada par de
        ligação.
      </p>

      {/* ─── Seção 5 ─── */}
      <h2
        id="por-que-relacional"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Por Que Se Chama &quot;Relacional&quot;
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Aqui mora uma confusão comum. Muita gente acha que &quot;relacional&quot;
        se refere aos relacionamentos entre tabelas. Faz sentido, mas a origem
        do nome é outra: vem da <strong>relação</strong>, o termo matemático que
        descreve uma tabela no modelo proposto por Edgar F. Codd em 1970. No
        modelo de Codd, cada tabela <em>é</em> uma relação.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Na prática, você não precisa decorar a teoria matemática. O que importa
        entender é que o modelo relacional organiza dados em tabelas com regras
        claras e permite combiná-las de forma previsível com SQL. As ligações
        entre tabelas são uma consequência maravilhosa do modelo - só não são a
        razão exata do nome.
      </p>

      {/* ─── Seção 6 ─── */}
      <h2
        id="relacional-vs-nao"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Banco de Dados Relacional vs Não Relacional
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Você provavelmente já ouviu falar de bancos &quot;NoSQL&quot; ou não
        relacionais, como MongoDB. Eles não são melhores nem piores - são
        ferramentas para problemas diferentes. Veja a comparação:
      </p>

      <ComparisonTable
        headers={["Aspecto", "Relacional (SQL)", "Não relacional (NoSQL)"]}
        rows={[
          [
            "Estrutura",
            "Tabelas com esquema fixo",
            "Documentos, chave-valor, grafos",
          ],
          [
            "Esquema",
            "Definido antes de inserir dados",
            "Flexível, pode variar por registro",
          ],
          [
            "Conexões entre dados",
            "JOINs entre tabelas",
            "Dados aninhados ou referências manuais",
          ],
          [
            "Consistência",
            "Forte (transações ACID)",
            "Costuma priorizar escala e velocidade",
          ],
          [
            "Melhor para",
            "Dados estruturados e relacionados",
            "Dados muito variáveis ou enorme volume",
          ],
          [
            "Exemplos",
            "PostgreSQL, MySQL, SQLite",
            "MongoDB, Redis, Cassandra",
          ],
        ]}
        caption="Cada modelo brilha em um cenário diferente"
        highlightFirst={true}
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Para a grande maioria das aplicações - sistemas de pedidos, cadastros,
        relatórios, qualquer coisa com dados bem estruturados e relacionados -
        o banco relacional é a escolha padrão. E é por isso que aprender SQL
        continua sendo uma das habilidades mais pedidas no mercado.
      </p>

      {/* ─── Seção 7 ─── */}
      <h2
        id="exemplo"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Um Exemplo Concreto: o Banco de Dados de um Caso
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Vamos juntar tudo. Imagine o banco de dados de uma investigação com três
        tabelas. Cada uma tem sua chave primária, e as chaves estrangeiras ligam
        umas às outras:
      </p>

      <EntityRelationship
        tables={[
          {
            name: "suspeitos",
            columns: ["id", "nome", "idade", "cidade"],
            primaryKey: "id",
          },
          {
            name: "depoimentos",
            columns: ["id", "suspeito_id", "alibi", "data"],
            primaryKey: "id",
          },
          {
            name: "provas",
            columns: ["id", "suspeito_id", "tipo", "descricao"],
            primaryKey: "id",
          },
        ]}
        relations={[
          {
            from: "suspeitos",
            to: "depoimentos",
            fromColumn: "id",
            toColumn: "suspeito_id",
            type: "1:N",
            label: "presta",
          },
          {
            from: "suspeitos",
            to: "provas",
            fromColumn: "id",
            toColumn: "suspeito_id",
            type: "1:N",
            label: "ligado a",
          },
        ]}
        caption="Três tabelas conectadas por chaves - um banco de dados relacional em miniatura"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        Repare na estrutura: a coluna <code>id</code> é a chave primária de cada
        tabela. A coluna <code>suspeito_id</code> em <code>depoimentos</code> e
        em <code>provas</code> é uma chave estrangeira que aponta de volta para{" "}
        <code>suspeitos.id</code>. Cada suspeito pode ter vários depoimentos e
        várias provas - dois relacionamentos 1:N.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Juntando as tabelas com SQL:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT s.nome, d.alibi, p.descricao
FROM suspeitos s
JOIN depoimentos d ON s.id = d.suspeito_id
JOIN provas p ON s.id = p.suspeito_id
WHERE s.cidade = 'São Paulo';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          O JOIN segue as chaves estrangeiras para reunir, numa única consulta,
          o nome do suspeito, o álibi e a prova ligada a ele. É exatamente para
          isso que o modelo relacional foi feito.
        </p>
      </div>

      <QuickQuiz
        title="🔍 Teste seu entendimento"
        questions={[
          {
            question:
              "O que identifica cada linha de uma tabela de forma única?",
            options: [
              "A chave estrangeira",
              "A chave primária",
              "A primeira coluna sempre",
              "O nome da tabela",
            ],
            correctIndex: 1,
            explanation:
              "A chave primária garante que cada linha tenha um identificador único dentro da tabela. A chave estrangeira aponta para a chave primária de outra tabela.",
          },
          {
            question:
              "Um suspeito pode ter vários depoimentos. Que tipo de relacionamento é esse?",
            options: ["1:1", "1:N", "N:N", "Nenhum"],
            correctIndex: 1,
            explanation:
              "Um para muitos (1:N): uma linha da tabela suspeitos se liga a várias linhas da tabela depoimentos.",
          },
          {
            question:
              "Por que o modelo é chamado de 'relacional'?",
            options: [
              "Por causa dos relacionamentos entre tabelas",
              "Porque cada tabela é uma 'relação' no modelo matemático de Codd",
              "Porque os dados se relacionam com o usuário",
              "Porque usa a palavra RELATION em SQL",
            ],
            correctIndex: 1,
            explanation:
              "O nome vem do termo matemático 'relação', que descreve uma tabela no modelo proposto por Edgar F. Codd em 1970.",
          },
        ]}
      />

      {/* CTA Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Quer ver bancos de dados relacionais na prática?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          No SQLNoir, cada caso de detetive é um banco de dados relacional de
          verdade. Você explora tabelas, segue chaves estrangeiras e usa JOINs
          para resolver crimes - direto no navegador, sem cadastro.
        </p>
        <Link
          href="/pt-br/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Explorar os casos →
        </Link>
      </div>

      {/* ─── FAQ ─── */}
      <h2
        id="faq"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Perguntas Frequentes
      </h2>

      <div className="space-y-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            O que é um banco de dados relacional em poucas palavras?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            É uma forma de organizar dados em tabelas que se conectam por meio
            de chaves. Cada tabela guarda um tipo de informação e as ligações
            entre elas evitam repetição de dados.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Qual a diferença entre chave primária e chave estrangeira?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            A chave primária identifica cada linha de forma única dentro da sua
            própria tabela. A chave estrangeira é uma coluna que aponta para a
            chave primária de outra tabela, criando a ligação entre elas.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Banco de dados relacional é o mesmo que SQL?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Não exatamente. O banco de dados relacional é o modelo de
            organização dos dados. O SQL é a linguagem que você usa para
            consultar e manipular esses dados. Eles andam juntos, mas são coisas
            diferentes.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Quais são exemplos de bancos de dados relacionais?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            PostgreSQL, MySQL, SQLite, SQL Server e Oracle são os mais
            conhecidos. Todos seguem o modelo relacional e usam SQL como
            linguagem de consulta.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Quando usar um banco não relacional?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Bancos não relacionais (NoSQL) costumam ser preferidos quando os
            dados são muito variáveis, sem esquema fixo, ou quando a aplicação
            precisa de escala extrema. Para dados estruturados e relacionados, o
            modelo relacional ainda é a escolha padrão.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        Agora que você entende tabelas, chaves e relacionamentos, o próximo
        passo é praticar. Se ainda está dando os primeiros passos, vale começar
        pelos{" "}
        <Link
          href="/pt-br/sql-para-iniciantes"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          fundamentos de SQL para iniciantes
        </Link>
        . A melhor forma de fixar o modelo relacional é consultar um de
        verdade - depois é só partir para os{" "}
        <Link
          href="/pt-br/cases"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          casos de detetive do SQLNoir
        </Link>{" "}
        e ver as tabelas se conectarem na prática.
      </p>
    </div>
  );
}
