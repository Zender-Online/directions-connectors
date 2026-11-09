# Conectores do Airbyte (cópia de referência)

Cópia **sem modificação** de três conectores do repositório
[airbytehq/airbyte](https://github.com/airbytehq/airbyte), no commit
`e8cdbb81b382fefdb662670e74342c073f7ccb4b` (04/11/2026). Eles são a fonte da tradução para o
nosso formato (`connectors/<id>.yaml`).

| Pasta | Conector | Versão | Tipo |
| --- | --- | --- | --- |
| `source-instagram` | Instagram | 4.2.50 | manifesto declarativo + `components.py` |
| `source-google-ads` | Google Ads | 6.1.9 | Python, com manifesto declarativo dentro de `source_google_ads/` |
| `source-google-analytics-data-api` | Google Analytics 4 | 2.11.10 | manifesto declarativo + `components.py` |

Ficaram de fora testes, fixtures, ícones e o `poetry.lock`.

## Licença

Os três são **Elastic License 2.0** (`LICENSE`, copiado do repositório de origem). A decisão de
copiar e traduzir foi do desenvolvedor responsável, em 04/11/2026, com a ressalva registrada:
a ELv2 proíbe oferecer o software, ou obra derivada, como serviço gerenciado a terceiros.

O que a licença exige e como cumprimos:

- **Levar os termos junto:** o `LICENSE` fica nesta pasta, e cada arquivo traduzido aponta
  para ele.
- **Marcar a modificação:** todo conector em `connectors/` traduzido daqui começa com um
  comentário dizendo de qual conector e commit veio e que foi modificado.
- **Não esconder avisos:** nada nesta pasta é editado. Atualizar é copiar de novo, de outro
  commit, e trocar o commit desta página.

Nada aqui entra no pacote: `scripts/files.mjs` só lê `catalogs/` e `connectors/`.
