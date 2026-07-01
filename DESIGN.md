# Especificação de Design: SIGAH (The Institutional Architect)

Este documento descreve a identidade visual, paleta de cores, tipografia e diretrizes de design do **Sistema Integrado de Gestão de Apoio Habitacional (SIGAH)**, extraído diretamente do projeto Stitch **DESIGN SIGAH**.

---

## 1. Conceito & North Star Criativa: "The Institutional Architect"

Inspirado nas linhas limpas, sobriedade e honestidade estrutural da arquitetura moderna brasileira. 
O sistema prioriza:
* **Clareza Editorial:** Leiautes autoritários, organizados com forte contraste tipográfico e assimetria inteligente.
* **Profundidade Tonal:** Substituição de bordas artificiais por transições de tom e elevação de camadas.
* **Estabilidade e Respiro:** Espaçamentos generosos para tornar dados governamentais complexos legíveis e agradáveis de operar.

---

## 2. Tipografia

O projeto utiliza um sistema de duas fontes para balancear autoridade institucional com legibilidade técnica extrema:

* **Headline & Display (Títulos):** `Public Sans`
  * Indicada para cabeçalhos e números de destaque (Display). Sua estabilidade geométrica confere um caráter oficial e estruturado.
* **Body, Titles & Labels (Corpo e Rótulos):** `Inter`
  * Indicada para formulários, dados de tabelas, botões e labels. A altura elevada de suas minúsculas (x-height) garante leitura nítida mesmo em tamanhos muito reduzidos (`0.6875rem`).

---

## 3. Paleta de Cores Principal

As cores principais estabelecem autoridade institucional e demarcam o fluxo de interação:

| Token | Cor | Amostra | Função / Aplicação |
| :--- | :---: | :---: | :--- |
| **Primary** | `#001e40` | `█` | Cor base da identidade, peso e "gravidade" institucional. |
| **Primary Container** | `#003366` | `█` | Fundo principal de componentes destacados e headers. |
| **Secondary** | `#0059bb` | `█` | Botões de ação primária, estados ativos e links de navegação. |
| **Secondary Container** | `#0070ea` | `█` | Elementos de destaque secundário e foco de atenção. |
| **Tertiary** | `#381300` | `█` | Alertas críticos, avisos importantes e ações destrutivas (terroso). |
| **Background / Surface** | `#f8f9fa` | `█` | Tom de fundo geral do sistema, leve e limpo. |

---

## 4. Tabela de Cores (Tokens Material Design)

Abaixo está a listagem completa dos valores hexadecimais configurados para o tema:

| Token de Cor | Valor Hexadecimal |
| :--- | :--- |
| `background` | `#f8f9fa` |
| `primary` | `#001e40` |
| `primary_container` | `#003366` |
| `on_primary` | `#ffffff` |
| `on_primary_container` | `#799dd6` |
| `secondary` | `#0059bb` |
| `secondary_container` | `#0070ea` |
| `on_secondary` | `#ffffff` |
| `tertiary` | `#381300` |
| `tertiary_container` | `#592300` |
| `on_tertiary` | `#ffffff` |
| `surface` | `#f8f9fa` |
| `surface_bright` | `#f8f9fa` |
| `surface_container` | `#edeeef` |
| `surface_container_high` | `#e7e8e9` |
| `surface_container_highest` | `#e1e3e4` |
| `surface_container_low` | `#f3f4f5` |
| `surface_container_lowest` | `#ffffff` |
| `surface_dim` | `#d9dadb` |
| `surface_variant` | `#e1e3e4` |
| `on_surface` | `#191c1d` |
| `on_surface_variant` | `#43474f` |
| `outline` | `#737780` |
| `outline_variant` | `#c3c6d1` |
| `error` | `#ba1a1a` |
| `error_container` | `#ffdad6` |
| `on_error` | `#ffffff` |
| `on_error_container` | `#93000a` |

---

## 5. Diretrizes de Layout e Estilo (Guidelines)

### A Regra "Sem Linhas" (No-Line Rule)
> [!IMPORTANT]
> **É estritamente proibido o uso de bordas sólidas de 1px** para separar seções de conteúdo ou cards. 
> As divisões devem ser feitas por meio de:
> 1. **Contraste de fundo:** Colocação de um card branco (`surface-container-lowest` / `#ffffff`) sobre um fundo cinza claro (`surface` / `#f8f9fa`).
> 2. **Espaçamentos generosos (Padding/Margin):** Uso de espaços vazios estruturados para isolar informações.

### Efeito "Glass & Gradient"
* **Navegação Lateral:** O menu principal de navegação deve usar efeito translúcido (Glassmorphism), aplicando desfoque de fundo (`backdrop-blur` entre 12px e 20px) sobre uma variação semi-transparente de `primary-container`.
* **Botões Primários:** Podem usar um gradiente linear sutil de 145 graus partindo de `primary` para `primary-container`.

### Sombras Ambientes
* Evite sombras escuras tradicionais. 
* Em modais e dropdowns flutuantes, utilize **Tinted Ambient Shadows** (sombras coloridas e difusas com 10% de opacidade do azul `primary`, 32px de blur e 16px de deslocamento vertical).
