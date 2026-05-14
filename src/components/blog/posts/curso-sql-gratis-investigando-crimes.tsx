"use client";

import Link from "next/link";
import {
  ProcessSteps,
  ComparisonTable,
} from "@/components/blog/diagrams";
import {
  SQLQueryBreakdown,
  DetectiveTip,
  MysteryTeaser,
  QuickQuiz,
} from "@/components/blog/content";

export default function CursoSqlGratisInvestigandoCrimesContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        O SQLNoir é um curso de SQL grátis em português onde você aprende
        resolvendo 6 crimes de verdade. Sem cadastro, sem cartão de crédito e
        sem instalar nada — você abre o navegador, escolhe um caso e começa a
        escrever consultas para encontrar o culpado. É o jeito mais rápido de
        sair do zero ao JOIN sem morrer de tédio.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Navegação rápida
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>
            •{" "}
            <a href="#por-que-gratis" className="hover:underline">
              Por que esse curso de SQL é realmente gratuito
            </a>
          </li>
          <li>
            •{" "}
            <a href="#o-que-voce-aprende" className="hover:underline">
              O que você vai aprender no curso
            </a>
          </li>
          <li>
            •{" "}
            <a href="#por-que-casos" className="hover:underline">
              Por que aprender investigando crimes funciona melhor
            </a>
          </li>
          <li>
            •{" "}
            <a href="#estrutura" className="hover:underline">
              Como o curso é estruturado
            </a>
          </li>
          <li>
            •{" "}
            <a href="#primeira-consulta" className="hover:underline">
              Sua primeira consulta SQL, passo a passo
            </a>
          </li>
          <li>
            •{" "}
            <a href="#como-comecar" className="hover:underline">
              Como começar agora
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
        id="por-que-gratis"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Por Que Esse Curso de SQL é Realmente Gratuito
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Existe muito &quot;curso de SQL gratuito&quot; por aí que pede e-mail,
        trava metade do conteúdo atrás de um plano premium ou exige instalar um
        banco de dados na máquina. O SQLNoir é diferente: os casos iniciais são
        100% livres, o editor de SQL roda direto no navegador e você não
        precisa criar conta para resolver seu primeiro mistério.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        A ideia é simples. Aprender SQL não deveria depender de configurar
        ambiente, baixar arquivos ou assistir três horas de vídeo antes de
        digitar a primeira linha. Aqui você escreve consultas de verdade contra
        um banco de dados de verdade desde o primeiro minuto — só que, em vez de
        tabelas chatas de &quot;funcionários&quot; e &quot;produtos&quot;, você
        investiga suspeitos, álibis e provas.
      </p>

      <DetectiveTip variant="tip" title="Sem pegadinha">
        O SQLNoir tem casos gratuitos e casos pagos opcionais, mas você consegue
        aprender SELECT, WHERE, JOIN e agregações inteiras só com a parte
        gratuita. Nada de cartão de crédito para começar.
      </DetectiveTip>

      {/* ─── Seção 2 ─── */}
      <h2
        id="o-que-voce-aprende"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        O Que Você Vai Aprender Neste Curso de SQL
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        O curso cobre exatamente os comandos que aparecem em vagas de analista
        de dados, analista de negócios e desenvolvedor. Você não vai decorar
        sintaxe solta — vai usar cada comando para responder uma pergunta da
        investigação.
      </p>

      <ComparisonTable
        headers={["Comando SQL", "O que faz", "Como você usa nos casos"]}
        rows={[
          [
            "SELECT",
            "Escolhe quais colunas você quer ver",
            "Listar nomes e descrições de suspeitos",
          ],
          [
            "WHERE",
            "Filtra as linhas por uma condição",
            "Encontrar quem estava na cena do crime",
          ],
          [
            "JOIN",
            "Combina dados de tabelas relacionadas",
            "Ligar suspeitos aos seus depoimentos e álibis",
          ],
          [
            "GROUP BY + COUNT",
            "Agrupa e conta registros",
            "Descobrir quem tem mais antecedentes",
          ],
          [
            "ORDER BY / LIMIT",
            "Ordena e limita os resultados",
            "Achar a testemunha mais recente da lista",
          ],
          [
            "LIKE / IS NULL",
            "Busca por padrões e valores ausentes",
            "Cruzar a descrição da testemunha com os arquivos",
          ],
        ]}
        caption="Os comandos essenciais cobertos pelo curso — todos aplicados na prática"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        No fim, você sai com a base sólida de SQL: sabe ler um banco de dados,
        filtrar informação relevante, juntar tabelas e resumir dados. É o
        suficiente para tirar relatórios no trabalho, mandar bem numa entrevista
        júnior ou seguir para tópicos avançados como subconsultas e funções de
        janela.
      </p>

      {/* ─── Seção 3 ─── */}
      <h2
        id="por-que-casos"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Por Que Aprender Investigando Crimes Funciona Melhor
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A maioria dos cursos de SQL é passiva: você assiste, copia o exemplo e
        esquece tudo na semana seguinte. O problema não é o conteúdo — é a falta
        de motivo para escrever a consulta. Quando o objetivo é só
        &quot;praticar SELECT&quot;, seu cérebro não se engaja. Quando o
        objetivo é descobrir quem roubou o diamante, ele engaja.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Aprender por casos funciona por três motivos concretos:
      </p>

      <ul className="text-gray-700 space-y-2 mb-6">
        <li>
          • <strong>Feedback imediato:</strong> a consulta retornou a pista
          certa ou não. Você não espera um professor corrigir nada.
        </li>
        <li>
          • <strong>Contexto real:</strong> os bancos de dados têm estrutura de
          verdade — chaves, relacionamentos, tabelas conectadas. Não são
          exemplos de brinquedo.
        </li>
        <li>
          • <strong>Dificuldade progressiva:</strong> o primeiro caso pede só
          SELECT e WHERE. Os próximos vão te empurrando para JOINs e
          agregações, sem susto.
        </li>
      </ul>

      <DetectiveTip variant="clue" title="A diferença na prática">
        Ler &quot;o JOIN combina duas tabelas pela chave&quot; é uma coisa.
        Precisar de um JOIN para ligar um suspeito ao álibi dele e finalmente
        fechar o caso é outra. A segunda gruda na memória.
      </DetectiveTip>

      {/* CTA Tier 1 */}
      <p className="text-gray-700 leading-relaxed mb-6">
        Quer ver na prática? Os{" "}
        <Link
          href="/pt-br/cases"
          className="text-amber-700 hover:text-amber-900 underline font-medium"
        >
          casos de detetive do SQLNoir
        </Link>{" "}
        começam fáceis e vão te ensinando cada comando no momento em que você
        precisa dele.
      </p>

      {/* ─── Seção 4 ─── */}
      <h2
        id="estrutura"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Como o Curso de SQL é Estruturado
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Em vez de módulos numerados e provas, o curso é uma sequência de casos.
        Cada caso é uma investigação completa com um banco de dados próprio. A
        progressão acontece naturalmente conforme os mistérios ficam mais
        complexos.
      </p>

      <ProcessSteps
        steps={[
          {
            number: 1,
            title: "Casos iniciais",
            description:
              "SELECT, WHERE e filtros básicos. Você lê tabelas e encontra suspeitos por características simples.",
            icon: "🟢",
            duration: "1ª semana",
          },
          {
            number: 2,
            title: "Casos intermediários",
            description:
              "JOINs entre várias tabelas, ORDER BY e LIMIT. Você liga provas, depoimentos e suspeitos.",
            icon: "🟡",
            duration: "2ª a 4ª semana",
          },
          {
            number: 3,
            title: "Casos avançados",
            description:
              "Agregações com GROUP BY, COUNT e subconsultas. Investigações com mais tabelas e pistas escondidas.",
            icon: "🔴",
            duration: "1º a 2º mês",
          },
        ]}
        caption="A progressão do curso: do primeiro SELECT até consultas com várias tabelas"
      />

      <p className="text-gray-700 leading-relaxed mb-6">
        São 6 casos de detetive disponíveis, do roubo ao assassinato. Cada um
        leva entre 30 e 60 minutos e pode ser feito no seu ritmo — pare quando
        quiser, volte depois, refaça se travar. Não há cronômetro nem nota.
      </p>

      {/* ─── Seção 5 ─── */}
      <h2
        id="primeira-consulta"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Sua Primeira Consulta SQL, Passo a Passo
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Para você ver como é simples começar, aqui está o tipo de consulta que
        aparece logo no primeiro caso. O objetivo: encontrar suspeitos que
        batem com a descrição de uma testemunha e checar se eles têm álibi.
      </p>

      <SQLQueryBreakdown
        clauses={[
          {
            keyword: "SELECT",
            code: "s.nome, s.descricao, d.alibi",
            annotation: "As colunas que você quer ver",
          },
          {
            keyword: "FROM",
            code: "suspeitos s",
            annotation: "A tabela principal da investigação",
          },
          {
            keyword: "JOIN",
            code: "depoimentos d ON s.id = d.suspeito_id",
            annotation: "Liga cada suspeito ao seu depoimento",
          },
          {
            keyword: "WHERE",
            code: "s.descricao LIKE '%cicatriz%'",
            annotation: "Filtra pela pista da testemunha",
          },
        ]}
        caption="Anatomia de uma consulta típica do primeiro caso do SQLNoir"
      />

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">A consulta completa:</h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT s.nome, s.descricao, d.alibi
FROM suspeitos s
JOIN depoimentos d ON s.id = d.suspeito_id
WHERE s.descricao LIKE '%cicatriz%'
  AND d.alibi IS NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Essa consulta encontra suspeitos com &quot;cicatriz&quot; na descrição
          que <strong>não têm álibi</strong> — exatamente as pessoas que merecem
          mais atenção na investigação. Você escreve isso no editor do
          navegador, roda, e vê o resultado na hora.
        </p>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Repare como cada linha tem um motivo claro. Não é sintaxe decorada — é
        uma pergunta da investigação traduzida para SQL. Esse é o coração do
        curso.
      </p>

      {/* CTA Tier 2 */}
      <MysteryTeaser
        caseNumber={1}
        caseTitle="A Maleta Desaparecida"
        challenge="Uma maleta sumiu de um escritório trancado. Use SELECT e WHERE para vasculhar os registros e descobrir quem teve acesso à sala."
        difficulty="beginner"
        href="/pt-br/cases"
      />

      {/* ─── Seção 6 ─── */}
      <h2
        id="como-comecar"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        Como Começar o Curso Agora
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Não tem segredo nem pré-requisito. Você não precisa saber programar, não
        precisa de matemática avançada e não precisa instalar nada. O caminho é
        este:
      </p>

      <ol className="text-gray-700 space-y-2 mb-6">
        <li>
          1. <strong>Abra o SQLNoir no navegador</strong> e escolha o primeiro
          caso.
        </li>
        <li>
          2. <strong>Leia o briefing da investigação</strong> — ele te diz o que
          você precisa descobrir.
        </li>
        <li>
          3. <strong>Escreva sua primeira consulta</strong> no editor. Comece
          com um SELECT simples só para ver os dados.
        </li>
        <li>
          4. <strong>Rode, observe o resultado</strong> e ajuste a consulta até
          chegar na pista certa.
        </li>
        <li>
          5. <strong>Resolva o caso</strong> e passe para o próximo, que vai
          pedir um comando novo.
        </li>
      </ol>

      <p className="text-gray-700 leading-relaxed mb-6">
        O mais importante é começar de verdade. Muita gente passa meses
        &quot;estudando SQL&quot; sem nunca escrever uma consulta. Aqui você
        digita a primeira em menos de cinco minutos.
      </p>

      <QuickQuiz
        title="🔍 Teste o que você já sabe"
        questions={[
          {
            question:
              "Qual comando você usa para escolher quais colunas aparecem no resultado?",
            options: ["WHERE", "SELECT", "JOIN", "GROUP BY"],
            correctIndex: 1,
            explanation:
              "SELECT define quais colunas você quer ver. O WHERE filtra linhas, o JOIN combina tabelas e o GROUP BY agrupa registros.",
          },
          {
            question:
              "Você quer ligar a tabela de suspeitos à tabela de depoimentos. Qual comando faz isso?",
            options: ["ORDER BY", "LIMIT", "JOIN", "LIKE"],
            correctIndex: 2,
            explanation:
              "O JOIN combina dados de tabelas relacionadas usando uma coluna em comum, como suspeito_id.",
          },
          {
            question: "Como encontrar suspeitos que NÃO têm álibi registrado?",
            options: [
              "WHERE alibi = NULL",
              "WHERE alibi IS NULL",
              "WHERE alibi != ''",
              "WHERE NOT alibi",
            ],
            correctIndex: 1,
            explanation:
              "Em SQL nada é igual a NULL, nem o próprio NULL. Sempre use IS NULL para testar valores ausentes.",
          },
        ]}
      />

      {/* CTA Tier 3 */}
      <div className="not-prose my-10 p-8 bg-gradient-to-br from-amber-50 to-amber-100/80 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-900 font-detective text-xl mb-2">
          Pronto para resolver seu primeiro caso?
        </p>
        <p className="text-amber-700 mb-5 max-w-lg mx-auto">
          O SQLNoir transforma o aprendizado de SQL em trabalho de detetive.
          São 6 mistérios, do básico ao JOIN, com editor no navegador e sem
          cadastro. Só você, o SQL e o caso.
        </p>
        <Link
          href="/pt-br/cases"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/90 hover:bg-amber-700/90 text-amber-100 rounded-lg font-detective text-lg transition-colors"
        >
          Começar a investigação →
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
            O curso de SQL é realmente gratuito?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Sim. Os casos iniciais do SQLNoir são gratuitos e cobrem SELECT,
            WHERE, JOIN e agregações. Existem casos pagos opcionais, mas você
            aprende a base de SQL inteira sem gastar nada e sem precisar de
            cartão de crédito.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Preciso criar uma conta para começar?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Não. Você abre o navegador, escolhe um caso e já começa a escrever
            consultas. Não há cadastro obrigatório para resolver os primeiros
            mistérios.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Preciso instalar algum banco de dados?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Não. O editor de SQL e o banco de dados de cada caso rodam direto no
            navegador. Você não precisa instalar PostgreSQL, MySQL nem
            configurar ambiente nenhum.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Funciona para quem nunca viu SQL na vida?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Sim. O primeiro caso pede apenas SELECT e WHERE, que leem quase como
            português. A dificuldade sobe aos poucos, então você nunca é jogado
            direto no nível difícil.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-gray-900 mb-2">
            Quanto tempo leva para terminar o curso?
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Cada caso leva de 30 a 60 minutos. Praticando um pouco por dia, dá
            para passar pelos 6 casos em poucas semanas e sair com uma base
            sólida de SQL.
          </p>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        O melhor curso de SQL é aquele que você realmente faz. Em vez de
        acumular videoaulas, escolha um caso, abra o editor e comece a
        investigar hoje mesmo. Vá para os{" "}
        <Link
          href="/pt-br/cases"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          casos do SQLNoir
        </Link>{" "}
        e escreva sua primeira consulta agora.
      </p>
    </div>
  );
}
