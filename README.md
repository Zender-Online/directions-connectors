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
