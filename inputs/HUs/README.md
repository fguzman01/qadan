# Inputs — Historias de Usuario

Esta carpeta contiene Historias de Usuario (HUs) que sirven como input para los agentes de qadan.

## Convenciones

- Una HU por archivo
- Formato Markdown
- Nombre del archivo: `{JIRA-ID}-{slug-feature}.md` (ej: `SAUCE-101-login.md`)
- La HU debe contener: ID, título, descripción, criterios de aceptación, datos de prueba

## Uso

Las HUs se invocan desde el slash command `/generate-testcases`:

```
/generate-testcases inputs/HUs/SAUCE-101-login.md
```

O pegando el contenido directamente:

```
/generate-testcases
[contenido de la HU pegado aquí]
```
