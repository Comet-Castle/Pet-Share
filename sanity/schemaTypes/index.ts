import type { SchemaTypeDefinition } from "sanity";
import { documentTypes } from "./documents";
import { objectTypes } from "./objects";

export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes];
