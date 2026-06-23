"use client";

import Image from "next/image";
import Link from "next/link";

export default function JogosParaAprenderSqlContent() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed mb-8">
        Em vez de penar com mais um tutorial sem graça, você pode aprender SQL
        resolvendo crimes, sobrevivendo em ilhas ou competindo com outros
        programadores. Estes 5 jogos de SQL deixam o aprendizado de banco de
        dados realmente divertido - e funcionam melhor que os métodos
        tradicionais.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          🎯 Navegação rápida
        </h3>
        <ul className="grid md:grid-cols-2 gap-2 text-blue-800">
          <li>
            •{" "}
            <a href="#sql-noir" className="hover:underline">
              SQL Noir - Jogo de detetive
            </a>
          </li>
          <li>
            •{" "}
            <a href="#sql-island" className="hover:underline">
              SQL Island - Jogo de aventura
            </a>
          </li>
          <li>
            •{" "}
            <a href="#sql-murder-mystery" className="hover:underline">
              SQL Murder Mystery
            </a>
          </li>
          <li>
            •{" "}
            <a href="#sql-police-department" className="hover:underline">
              SQL Police Department
            </a>
          </li>
          <li>
            •{" "}
            <a href="#sqlzoo" className="hover:underline">
              SQLZoo - Tutoriais interativos
            </a>
          </li>
        </ul>
      </div>

      <h2
        id="sql-noir"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        1. SQL Noir - Jogo de SQL de detetive
      </h2>

      <div className="mb-8">
        <Image
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*PzS4hHajDcTcLtWr"
          alt="Interface do jogo SQL Noir mostrando um caso de detetive com editor de consultas SQL e banco de dados de crime"
          width={1400}
          height={788}
          className="w-full rounded-lg shadow-lg h-auto"
          priority
        />
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>
          <Link
            href="/pt-br"
            className="text-amber-900 hover:text-amber-700 underline"
          >
            SQL Noir
          </Link>
        </strong>{" "}
        é a minha tentativa de tornar o aprendizado de SQL realmente divertido.
        Eu o criei porque estava cansado de tutoriais entediantes. Você joga
        como um detetive resolvendo crimes com consultas SQL - cada caso tem
        bancos de dados realistas com suspeitos, provas e depoimentos de
        testemunhas.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Exemplo de consulta do SQL Noir:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT s.name, s.description, i.alibi
FROM suspects s
JOIN interviews i ON s.id = i.suspect_id
WHERE s.description LIKE '%scar on left cheek%'
AND i.alibi IS NOT NULL;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Essa consulta ajuda a identificar suspeitos que batem com a descrição
          da testemunha e verifica os álibis deles.
        </p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
        <h4 className="font-bold text-amber-900 mb-3">
          Por que o SQL Noir funciona tão bem:
        </h4>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>
            • <strong>6 casos de detetive:</strong> de roubo a
            assassinato
          </li>
          <li>
            • <strong>Fica difícil de verdade:</strong> começa fácil com SELECT
            e depois te pega com JOINs e subconsultas
          </li>
          <li>
            • <strong>Estruturas de banco de dados reais:</strong> nada de
            exemplos de brinquedo - esquemas que fazem sentido
          </li>
          <li>
            • <strong>Você sabe na hora se errou:</strong> sem esperar um
            professor corrigir seu trabalho
          </li>
          <li>
            • <strong>É gratuito:</strong> sem paywall, sem &quot;recursos
            premium&quot;
          </li>
          <li>
            • <strong>Sem instalação:</strong> é só abrir o navegador e começar
            a jogar
          </li>
        </ul>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-bold text-amber-800 mb-2">✅ Pontos fortes:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Narrativa envolvente</li>
              <li>• Cobre todos os níveis de SQL</li>
              <li>• Cenários de banco de dados realistas</li>
              <li>• Disponível em português, inglês e chinês</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-amber-800 mb-2">
              ⚠️ Pontos de atenção:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Pode ser desafiador para iniciantes absolutos</li>
              <li>• Exige raciocínio lógico</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-amber-800">
          <strong>Melhor para:</strong> quem gosta de histórias e quer praticar
          SQL com dados realistas.
        </p>
        <p className="mt-2 text-amber-800">
          <strong>Tempo:</strong> 30 a 60 minutos por caso
        </p>
        <div className="mt-4">
          <Link
            href="/pt-br/cases"
            className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Jogar SQL Noir →
          </Link>
        </div>
      </div>

      <h2
        id="sql-island"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        2. SQL Island - Jogo de aventura e sobrevivência
      </h2>

      <div className="mb-8">
        <Image
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*1nl6U643v-n-a8Vu"
          alt="Captura de tela da interface do jogo SQL Island, um jogo de aventura e sobrevivência para aprender SQL"
          width={1400}
          height={788}
          className="w-full rounded-lg shadow-lg h-auto"
        />
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>
          <a
            href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-900 hover:text-blue-700 underline"
          >
            SQL Island
          </a>
        </strong>{" "}
        tem uma premissa simples: você sofre um acidente e cai numa ilha, e
        precisa de SQL para sobreviver. Quer comida? Consulte o banco de dados.
        Precisa de emprego? Melhor saber usar ORDER BY. É meio brega, mas
        funciona, principalmente se você está começando agora.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Exemplo de consulta de sobrevivência:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT *
FROM inhabitant
WHERE job = 'baker'
ORDER BY gold DESC
LIMIT 1;`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Encontre o padeiro mais rico da ilha para garantir emprego e ouro.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
        <h4 className="font-bold text-blue-900 mb-3">
          Principais características:
        </h4>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>
            • <strong>Enredo de aventura:</strong> uma narrativa envolvente que
            puxa o aprendizado para frente
          </li>
          <li>
            • <strong>Desafios progressivos:</strong> as tarefas vão ficando
            mais complexas conforme você avança
          </li>
          <li>
            • <strong>Suporte a vários idiomas:</strong> disponível em inglês e
            alemão
          </li>
          <li>
            • <strong>Prática de SQL real:</strong> você trabalha com operações
            de banco de dados de verdade
          </li>
          <li>
            • <strong>Gestão de recursos:</strong> aprenda a otimizar consultas
            por eficiência
          </li>
        </ul>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-bold text-blue-800 mb-2">✅ Pontos fortes:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Tema de aventura original</li>
              <li>• Excelente para iniciantes</li>
              <li>• Gratuito e acessível</li>
              <li>• Sistema de progressão claro</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-blue-800 mb-2">
              ⚠️ Pontos de atenção:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• A interface parece datada</li>
              <li>• Conceitos avançados de SQL limitados</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-blue-800">
          <strong>Melhor para:</strong> iniciantes absolutos que preferem temas
          de aventura e progressão passo a passo.
        </p>
        <p className="mt-2 text-blue-800">
          <strong>Tempo necessário:</strong> 1 a 2 horas para concluir,
          dependendo do seu nível.
        </p>
        <div className="mt-4">
          <a
            href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Jogar SQL Island →
          </a>
        </div>
      </div>

      <h2
        id="sql-murder-mystery"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        3. SQL Murder Mystery - O clássico desafio de detetive
      </h2>

      <div className="mb-8">
        <Image
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*foI_PrQp9hmWhE9r"
          alt="Interface do jogo SQL Murder Mystery, a plataforma de aprendizado de SQL de detetive da Northwestern University"
          width={1400}
          height={788}
          className="w-full rounded-lg shadow-lg h-auto"
        />
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>
          <a
            href="https://mystery.knightlab.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-900 hover:text-red-700 underline"
          >
            SQL Murder Mystery
          </a>
        </strong>{" "}
        é o jogo de SQL original que começou tudo. A Northwestern University
        criou esse jogo e ele tem apenas um caso - resolver um assassinato na
        SQL City. O conceito é simples, mas é muito bem feito e ensina JOINs
        melhor do que qualquer tutorial que eu já vi. Aliás, o SQL Noir foi
        inspirado nesse jogo.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Exemplo de consulta de investigação:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT p.name, p.license_id, p.ssn
FROM person p
JOIN drivers_license dl ON p.license_id = dl.id
WHERE dl.plate_number LIKE '%H42W%';`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Rastreie suspeitos cruzando informações parciais de placa de carro com
          os registros de motoristas.
        </p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
        <h4 className="font-bold text-red-900 mb-3">Destaques do jogo:</h4>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>
            • <strong>Um único caso focado:</strong> um mistério de assassinato
            envolvente para resolver
          </li>
          <li>
            • <strong>Esquema de banco de dados realista:</strong> você trabalha
            com boletins de ocorrência, depoimentos e registros da cidade
          </li>
          <li>
            • <strong>Desenho educacional:</strong> apoiado por expertise
            acadêmica em design de aprendizado
          </li>
          <li>
            • <strong>Aprendizado no seu ritmo:</strong> sem pressão de tempo,
            explore na velocidade que quiser
          </li>
          <li>
            • <strong>Soluções da comunidade:</strong> compartilhe abordagens
            com outros detetives
          </li>
        </ul>

        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <h5 className="font-bold text-red-900 mb-2">
            🎯 O que você vai aprender:
          </h5>
          <ul className="text-red-800 text-sm space-y-1">
            <li>• Operações de JOIN avançadas entre várias tabelas</li>
            <li>• Cláusulas WHERE com condições complexas</li>
            <li>• Filtragem de dados e busca por padrões</li>
            <li>• Dedução lógica por meio da análise de dados</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-bold text-red-800 mb-2">✅ Pontos fortes:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Excelente para praticar JOINs</li>
              <li>• Progressão de aprendizado bem desenhada</li>
              <li>• Totalmente gratuito e de código aberto</li>
              <li>• Ótima introdução à análise de dados</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-red-800 mb-2">
              ⚠️ Pontos de atenção:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Apenas um caso para resolver</li>
              <li>• Pode ser concluído rapidamente</li>
              <li>• Pouca rejogabilidade</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-red-800">
          <strong>Melhor para:</strong> usuários intermediários que querem
          praticar consultas complexas e raciocínio lógico.
        </p>
        <p className="mt-2 text-red-800">
          <strong>Tempo necessário:</strong> 1 a 3 horas, dependendo da
          experiência com SQL
        </p>
        <div className="mt-4">
          <a
            href="https://mystery.knightlab.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Jogar SQL Murder Mystery →
          </a>
        </div>
      </div>

      <h2
        id="sql-police-department"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        4. SQL Police Department (SQLPD) - Treinamento de detetive premium
      </h2>

      <div className="mb-8">
        <Image
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*BT8lIzDDrdPhPyMl"
          alt="Interface do jogo SQL Police Department (SQLPD), uma plataforma premium de treinamento de SQL de detetive"
          width={1400}
          height={788}
          className="w-full rounded-lg shadow-lg h-auto"
        />
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>
          <a
            href="https://sqlpd.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-900 hover:text-green-700 underline"
          >
            SQL Police Department (SQLPD)
          </a>
        </strong>{" "}
        ensina SQL por meio de diferentes missões (ou casos) em uma delegacia de
        polícia. Você recebe o briefing de vários crimes e precisa escrever
        consultas SQL para resolvê-los. A interface é um pouco mais voltada para
        celular, mas ainda assim é uma ótima forma de aprender SQL. Você não tem
        um editor de SQL tradicional, e sim um conjunto de botões que oferecem
        opções de palavras-chave para montar a consulta.
      </p>

      <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
        <h4 className="font-bold text-green-900 mb-3">Recursos premium:</h4>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>
            • <strong>Vários tipos de caso:</strong> cenários de fraude, roubo,
            assassinato e crime violento
          </li>
          <li>
            • <strong>Boa escrita:</strong> narrativas envolventes e de alta
            qualidade
          </li>
          <li>
            • <strong>Sistema de dicas:</strong> pistas que guiam o aprendizado
            sem entregar a solução
          </li>
          <li>
            • <strong>Casos gratuitos de teste:</strong> experimente antes de
            comprar, com casos de amostra
          </li>
        </ul>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-bold text-green-800 mb-2">
              ✅ Pontos fortes:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Casos de qualidade e escrita muito boas</li>
              <li>• Cobre conceitos básicos de SQL</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-green-800 mb-2">
              ⚠️ Pontos de atenção:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Exige pagamento para acesso completo</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-green-800">
          <strong>Melhor para:</strong> usuários de iniciante a avançado se
          preparando para vagas de dados ou em busca de uma experiência de
          aprendizado premium.
        </p>
        <p className="mt-2 text-green-800">
          <strong>Tempo necessário:</strong> 5 a 30 minutos por caso
        </p>
        <div className="mt-4">
          <a
            href="https://sqlpd.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Experimentar o SQLPD →
          </a>
        </div>
      </div>

      <h2
        id="sqlzoo"
        className="text-3xl font-detective text-amber-900 mt-12 mb-6"
      >
        5. SQLZoo - O tutorial interativo mais completo
      </h2>

      <div className="mb-8">
        <Image
          src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*WaOubGQPf431s8oR"
          alt="Interface do tutorial interativo de SQL SQLZoo, uma plataforma completa de aprendizado de banco de dados"
          width={1400}
          height={788}
          className="w-full rounded-lg shadow-lg h-auto"
        />
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        <strong>
          <a
            href="https://sqlzoo.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-900 hover:text-purple-700 underline"
          >
            SQLZoo
          </a>
        </strong>{" "}
        é a referência de aprendizado interativo de SQL há mais de duas décadas.
        Apesar de ser menos parecido com um jogo do que as outras opções, sua
        abordagem sistemática e a cobertura completa fazem dele um recurso
        essencial para dominar os fundamentos e os conceitos avançados de SQL.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h4 className="font-bold text-gray-900 mb-3">
          Exemplo de exercício de aprendizado:
        </h4>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`SELECT name, continent, population
FROM world
WHERE population > (
  SELECT population
  FROM world
  WHERE name = 'Canada'
)
AND population < (
  SELECT population
  FROM world
  WHERE name = 'Poland'
);`}
        </pre>
        <p className="text-gray-600 text-sm mt-2">
          Encontre países com população entre a do Canadá e a da Polônia usando
          subconsultas.
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-400 p-6 mb-8">
        <h4 className="font-bold text-purple-900 mb-3">
          Recursos de aprendizado completos:
        </h4>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li>
            • <strong>Currículo estruturado:</strong> mais de 15 seções de
            tutorial cobrindo todos os conceitos de SQL
          </li>
          <li>
            • <strong>Conjuntos de dados reais:</strong> trabalhe com
            estatísticas mundiais, prêmios Nobel e muito mais
          </li>
          <li>
            • <strong>Dificuldade progressiva:</strong> do SELECT básico às&nbsp;
            <a
              href="https://sqlzoo.net/wiki/Window_functions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              funções&nbsp;de&nbsp;janela&nbsp;avançadas
            </a>
          </li>
          <li>
            • <strong>Ferramentas de avaliação:</strong> quizzes e desafios
            integrados
          </li>
          <li>
            • <strong>Sem cadastro necessário:</strong> comece a aprender na
            hora
          </li>
        </ul>

        <div className="bg-purple-100 p-4 rounded-lg mb-4">
          <h5 className="font-bold text-purple-900 mb-2">
            📚 Cobertura completa de SQL:
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-purple-800 text-sm">
            <ul className="space-y-1">
              <li>• Fundamentos do SELECT e consultas avançadas</li>
              <li>• JOINs (INNER, LEFT, RIGHT, FULL)</li>
              <li>• GROUP BY e funções de agregação</li>
              <li>• Subconsultas e tabelas derivadas</li>
            </ul>
            <ul className="space-y-1">
              <li>• Funções de janela e analytics</li>
              <li>• Manipulação de data e hora</li>
              <li>• Funções de texto e busca por padrões</li>
              <li>• Técnicas de otimização de banco de dados</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-bold text-purple-800 mb-2">
              ✅ Pontos fortes:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• A cobertura de SQL mais completa</li>
              <li>• Abordagem de aprendizado testada pelo tempo</li>
              <li>• Acesso totalmente gratuito</li>
              <li>• Excelente para preparação de entrevistas</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-purple-800 mb-2">
              ⚠️ Pontos de atenção:
            </h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Menos envolvente que jogos com narrativa</li>
              <li>• A interface parece datada</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-purple-800">
          <strong>Melhor para:</strong> todos os níveis, principalmente quem
          prefere aprendizado sistemático e cobertura completa.
        </p>
        <p className="mt-2 text-purple-800">
          <strong>Tempo necessário:</strong> recurso de referência e prática
          contínua
        </p>
        <div className="mt-4">
          <a
            href="https://sqlzoo.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Experimentar o SQLZoo →
          </a>
        </div>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        🎯 Escolhendo o jogo de SQL certo para o seu objetivo
      </h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-3">
            🚀 Para iniciantes absolutos
          </h4>
          <p className="text-blue-800 text-sm mb-3">
            Se você está começando SQL do zero, vale primeiro entender os{" "}
            <Link
              href="/pt-br/sql-para-iniciantes"
              className="underline hover:text-blue-900"
            >
              conceitos básicos de SQL para iniciantes
            </Link>{" "}
            antes de partir para os jogos.
          </p>
          <ol className="text-blue-800 space-y-2">
            <li>
              1.{" "}
              <strong>
                <a
                  href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQL Island
                </a>
              </strong>{" "}
              - Introdução suave com tema de aventura
            </li>
            <li>
              2.{" "}
              <strong>
                <a
                  href="https://sqlzoo.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQLZoo
                </a>
              </strong>{" "}
              - Fundamentos sistemáticos
            </li>
            <li>
              3.{" "}
              <strong>
                <Link href="/pt-br" className="hover:underline">
                  SQL Noir
                </Link>
              </strong>{" "}
              - Quando já estiver à vontade com o básico
            </li>
          </ol>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-bold text-green-900 mb-3">
            ⚡ Para quem está no nível intermediário
          </h4>
          <ol className="text-green-800 space-y-2">
            <li>
              1.{" "}
              <strong>
                <Link href="/pt-br" className="hover:underline">
                  SQL Noir
                </Link>
              </strong>{" "}
              - Cenários realistas e dificuldade progressiva
            </li>
            <li>
              2.{" "}
              <strong>
                <a
                  href="https://mystery.knightlab.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQL Murder Mystery
                </a>
              </strong>{" "}
              - Pratique JOINs complexos
            </li>
            <li>
              3.{" "}
              <strong>
                <a
                  href="https://sqlpd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQLPD
                </a>
              </strong>{" "}
              - Casos premium para desafios mais profundos
            </li>
          </ol>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-bold text-purple-900 mb-3">
            🎓 Para preparação de entrevistas
          </h4>
          <ol className="text-purple-800 space-y-2">
            <li>
              1.{" "}
              <strong>
                <a
                  href="https://sqlzoo.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQLZoo
                </a>
              </strong>{" "}
              - Cobertura completa de conceitos
            </li>
            <li>
              2.{" "}
              <strong>
                <a
                  href="https://sqlpd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQLPD
                </a>
              </strong>{" "}
              - Prática com cenários de negócio
            </li>
            <li>
              3.{" "}
              <strong>
                <Link href="/pt-br" className="hover:underline">
                  SQL Noir
                </Link>
              </strong>{" "}
              - Habilidades de raciocínio lógico
            </li>
          </ol>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="font-bold text-orange-900 mb-3">
            🏆 Para usuários avançados
          </h4>
          <ol className="text-orange-800 space-y-2">
            <li>
              1.{" "}
              <strong>
                <a
                  href="https://sqlpd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQLPD
                </a>
              </strong>{" "}
              - Desafios analíticos complexos
            </li>
            <li>
              2.{" "}
              <strong>
                <Link href="/pt-br" className="hover:underline">
                  SQL Noir
                </Link>
              </strong>{" "}
              - Casos de detetive avançados
            </li>
            <li>
              3.{" "}
              <strong>
                <a
                  href="https://sqlzoo.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SQLZoo
                </a>
              </strong>{" "}
              - Domine funções de janela e otimização
            </li>
          </ol>
        </div>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        📊 Tabela comparativa dos jogos de SQL
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Jogo</th>
              <th className="border border-gray-300 p-3 text-left">Preço</th>
              <th className="border border-gray-300 p-3 text-left">
                Dificuldade
              </th>
              <th className="border border-gray-300 p-3 text-left">Tema</th>
              <th className="border border-gray-300 p-3 text-left">
                Melhor recurso
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 font-semibold">
                SQL Noir
              </td>
              <td className="border border-gray-300 p-3 text-green-600">
                Gratuito
              </td>
              <td className="border border-gray-300 p-3">
                Iniciante a avançado
              </td>
              <td className="border border-gray-300 p-3">
                Mistério de detetive
              </td>
              <td className="border border-gray-300 p-3">
                Narrativa imersiva
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">
                SQL Island
              </td>
              <td className="border border-gray-300 p-3 text-green-600">
                Gratuito
              </td>
              <td className="border border-gray-300 p-3">Iniciante</td>
              <td className="border border-gray-300 p-3">
                Aventura e sobrevivência
              </td>
              <td className="border border-gray-300 p-3">
                Progressão amigável para iniciantes
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 font-semibold">
                SQL Murder Mystery
              </td>
              <td className="border border-gray-300 p-3 text-green-600">
                Gratuito
              </td>
              <td className="border border-gray-300 p-3">Intermediário</td>
              <td className="border border-gray-300 p-3">
                Investigação de crime
              </td>
              <td className="border border-gray-300 p-3">
                Qualidade de design acadêmico
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold">
                SQLPD
              </td>
              <td className="border border-gray-300 p-3 text-orange-600">
                Pago
              </td>
              <td className="border border-gray-300 p-3">
                Intermediário a avançado
              </td>
              <td className="border border-gray-300 p-3">
                Detetive policial
              </td>
              <td className="border border-gray-300 p-3">
                Qualidade premium dos casos
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 font-semibold">
                SQLZoo
              </td>
              <td className="border border-gray-300 p-3 text-green-600">
                Gratuito
              </td>
              <td className="border border-gray-300 p-3">Todos os níveis</td>
              <td className="border border-gray-300 p-3">
                Tutorial educacional
              </td>
              <td className="border border-gray-300 p-3">
                Cobertura completa
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
        Qual jogo de SQL você deveria experimentar primeiro?
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        A questão é a seguinte: todos esses jogos de SQL funcionam, mas
        funcionam para perfis diferentes. Se você gosta de histórias e não se
        importa com um bom desafio, comece pelo{" "}
        <Link
          href="/pt-br"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          SQL Noir
        </Link>
        . Se você é completamente novo em SQL, o{" "}
        <a
          href="http://wwwlgis.informatik.uni-kl.de/extra/game/?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-900 underline"
        >
          SQL Island
        </a>{" "}
        é provavelmente a melhor aposta. Quer algo profundo e focado? Vá de{" "}
        <a
          href="https://mystery.knightlab.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-700 hover:text-red-900 underline"
        >
          SQL Murder Mystery
        </a>
        .
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        O mais importante é realmente começar. Eu perdi meses adiando o
        aprendizado de SQL porque os livros pareciam intimidadores. Esses jogos
        deixam tudo mais fácil - você simplesmente entra e começa a brincar com
        as consultas.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-amber-900 mb-3">
          O que fazer a seguir
        </h3>
        <ol className="space-y-2 text-amber-800">
          <li>
            1. Escolha um jogo desta lista (sério, só escolha um)
          </li>
          <li>2. Passe 30 minutos jogando ele hoje</li>
          <li>
            3. Se você travar, é normal - continue
          </li>
          <li>
            4. Experimente outro jogo se o primeiro não te conquistar
          </li>
          <li>
            5. Quando terminar um, tente outro com uma abordagem diferente
          </li>
        </ol>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">
        Não complique. O melhor jogo de SQL é aquele que você de fato vai
        jogar. Escolha um, comece hoje e veja como aprender consultas de banco
        de dados pode ser muito mais divertido. Se quiser começar agora pelo
        jogo de detetive,{" "}
        <Link
          href="/pt-br"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          o SQLNoir está em português
        </Link>{" "}
        e seus{" "}
        <Link
          href="/pt-br/cases"
          className="text-amber-700 hover:text-amber-900 underline"
        >
          casos de detetive
        </Link>{" "}
        esperam por você.
      </p>
    </div>
  );
}
