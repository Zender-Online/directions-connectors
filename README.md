# directions-connectors

Os catálogos e conectores globais da ingestão do Directions: o que toda organização vê quando o
agente procura um dado. Catálogos que uma organização cadastra para si, como um portal interno com
credencial, não moram aqui: ficam no banco da engine (`data_catalog`).

## O que tem aqui

| Pasta          | O que é                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| `catalogs/`    | Um arquivo por catálogo: um portal CKAN, o dados.gov.br ou um catálogo curado.   |
| `connectors/`  | Um arquivo por conector declarativo: a API de um app, lida pela fonte HTTP.     |
| `schema/`      | O JSON Schema dos dois tipos de arquivo, gerado do monorepo. Não editar à mão.  |

O catálogo curado (`catalogs/registro-curado.yaml`) veio do antigo `source-registry.ts`. A regra
dele continua valendo: todo endereço foi sondado, e `checkedAt` diz quando respondeu. Um conjunto
sem porta aberta fica registrado com `endpoint: null` e o motivo em `note`, porque "não existe
fonte aberta" é resposta.

`updatedAt`, opcional, é o dia em que o publicador mudou o dado. A engine compara esse dia com a
última execução de cada fonte e avisa no sino quando ele é mais novo. Não confundir com
`checkedAt`: sondar de novo não é versão nova.

- A fonte do dia é o `Last-Modified` do arquivo que a fonte baixa, em UTC. O "Atualizado em" da
  página do portal vale só quando o arquivo não diz.
- Medido em 04/11/2026: nas páginas do INEP, o "Atualizado em" bate com o arquivo em quatro das
  cinco entradas. No ICA a página dizia 01/04 e o arquivo, 24/08.
- Mudar o `updatedAt` é publicar uma tag nova: é ela que leva o dia às engines.

## Versão

A engine carrega **uma tag publicada** deste repositório, fixada na configuração do deploy. Ela
nunca lê a tag mais nova sozinha:

1. a mudança entra por PR, e o CI valida cada arquivo contra `schema/`;
2. publicar a tag (`vX.Y.Z`) gera a release com `connectors-bundle.json` e o hash dele;
3. atualizar é trocar a tag fixada na engine.

Cada receita guarda a tag e o hash do conector que foi aprovado. Uma tag nova que muda esse
conector pede nova aprovação da receita.

## Comandos

```sh
npm ci
npm run validate          # valida todos os arquivos
npm run bundle -- v0.1.0  # gera dist/connectors-bundle.json
```

## Atualizar o schema

O schema é gerado do pacote `@directions/ingestion-sources`, no monorepo do Directions:

```sh
pnpm --filter @directions/ingestion-sources build
pnpm --filter @directions/ingestion-sources schemas:connectors <caminho deste repositório>/schema
```

A engine valida de novo com o mesmo schema, em Zod, quando carrega a tag. Algumas regras do
manifesto HTTP só existem lá, porque o JSON Schema não consegue expressá-las.

## Licença de conectores de terceiros

Antes de trazer um conector da Airbyte, confira a licença no registro dela. A maioria é ELv2, que
proíbe oferecer o software como serviço gerenciado a terceiros, e isso precisa de avaliação
jurídica. Os conectores com licença MIT podem ser convertidos.
