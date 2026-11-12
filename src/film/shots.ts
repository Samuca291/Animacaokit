// Agregador dos planos de todas as seções.
import type { ShotDef } from './timeline';
import { S1 } from './shots/s1';
import { S2 } from './shots/s2';
import { S3 } from './shots/s3';
import { S4 } from './shots/s4';
import { S5 } from './shots/s5';
import { S6 } from './shots/s6';
import { S7 } from './shots/s7';
import { S8 } from './shots/s8';

export const ALL: ShotDef[] = [...S1, ...S2, ...S3, ...S4, ...S5, ...S6, ...S7, ...S8];
