export interface DocsConfig {
    server: string,
    title: string,
    headers: string[],
    docs: string[]
}
export interface DocsInput {
    name: string,
    description: string,
    type?: string
}
export interface DocsForm {
    title: string,
    description: string,
    url: string,
    method: string,
    inputs: DocsInput[]
}
export interface DocsModel {
    title: string,
    forms: DocsForm[]
}