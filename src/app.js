import paper from 'paper';
import { createToken, Lexer, CstParser } from 'chevrotain';
import { PALETTE } from './palette.js';

// 1. Letter path dictionary (all at origin, canonical size)
// Cal Sans, https://danmarshall.github.io/google-font-to-svg-path/
const LETTER_PATHS = {
"a": "M 42.201 9.3 L 42.201 1.1 L 55.601 1.1 L 55.601 53.1 L 42.501 53.1 L 42.501 44.6 Q 40.401 49 36.551 51.7 Q 32.701 54.4 25.701 54.4 Q 18.601 54.4 12.751 50.75 Q 6.901 47.1 3.451 40.95 Q 0.001 34.8 0.001 27.3 Q 0.001 21.7 2.001 16.75 Q 4.001 11.8 7.501 8.05 Q 11.001 4.3 15.651 2.15 Q 20.301 0 25.701 0 Q 32.501 0 36.301 2.55 Q 40.101 5.1 42.201 9.3 Z M 27.901 42.2 Q 32.401 42.2 35.651 40.15 Q 38.901 38.1 40.701 34.7 Q 42.501 31.3 42.501 27.3 Q 42.501 23.2 40.701 19.8 Q 38.901 16.4 35.651 14.3 Q 32.401 12.2 27.901 12.2 Q 23.601 12.2 20.351 14.25 Q 17.101 16.3 15.301 19.7 Q 13.501 23.1 13.501 27.2 Q 13.501 31.1 15.301 34.55 Q 17.101 38 20.351 40.1 Q 23.601 42.2 27.901 42.2 Z",
"b": "M 13.1 64.5 L 13.1 73 L 0 73 L 0 0 L 13.5 0 L 13.5 29 Q 15.6 24.9 19.4 22.4 Q 23.2 19.9 29.9 19.9 Q 35.3 19.9 39.95 22.05 Q 44.6 24.2 48.1 27.95 Q 51.6 31.7 53.6 36.65 Q 55.6 41.6 55.6 47.2 Q 55.6 54.7 52.15 60.85 Q 48.7 67 42.9 70.65 Q 37.1 74.3 29.9 74.3 Q 22.9 74.3 19.05 71.6 Q 15.2 68.9 13.1 64.5 Z M 27.7 62.1 Q 32 62.1 35.25 60 Q 38.5 57.9 40.3 54.45 Q 42.1 51 42.1 47.1 Q 42.1 43 40.3 39.6 Q 38.5 36.2 35.25 34.15 Q 32 32.1 27.7 32.1 Q 23.3 32.1 20 34.2 Q 16.7 36.3 14.9 39.7 Q 13.1 43.1 13.1 47.2 Q 13.1 51.2 14.9 54.6 Q 16.7 58 20 60.05 Q 23.3 62.1 27.7 62.1 Z",
"c": "M 49.101 9.704 L 38.701 18.204 Q 36.901 15.504 34.051 13.904 Q 31.201 12.304 27.701 12.304 Q 23.401 12.304 20.201 14.354 Q 17.001 16.404 15.251 19.804 Q 13.501 23.204 13.501 27.304 Q 13.501 31.304 15.351 34.754 Q 17.201 38.204 20.451 40.254 Q 23.701 42.304 28.001 42.304 Q 31.901 42.304 34.601 40.554 Q 37.301 38.804 39.301 36.104 L 49.101 44.604 Q 45.401 49.304 39.951 51.954 Q 34.501 54.604 26.801 54.604 Q 21.201 54.604 16.351 52.504 Q 11.501 50.404 7.801 46.654 Q 4.101 42.904 2.051 37.954 Q 0.001 33.004 0.001 27.304 Q 0.001 19.704 3.551 13.554 Q 7.101 7.404 13.351 3.704 Q 19.601 0.004 27.501 0.004 Q 34.601 -0.096 40.201 2.504 Q 45.801 5.104 49.101 9.704 Z",
"d": "M 42.101 29 L 42.101 0 L 55.601 0 L 55.601 73 L 42.501 73 L 42.501 64.5 Q 40.401 68.9 36.551 71.6 Q 32.701 74.3 25.701 74.3 Q 18.601 74.3 12.751 70.65 Q 6.901 67 3.451 60.85 Q 0.001 54.7 0.001 47.2 Q 0.001 41.6 2.001 36.65 Q 4.001 31.7 7.501 27.95 Q 11.001 24.2 15.651 22.05 Q 20.301 19.9 25.701 19.9 Q 32.401 19.9 36.201 22.4 Q 40.001 24.9 42.101 29 Z M 27.901 62.1 Q 32.401 62.1 35.651 60.05 Q 38.901 58 40.701 54.6 Q 42.501 51.2 42.501 47.2 Q 42.501 43.1 40.701 39.7 Q 38.901 36.3 35.651 34.2 Q 32.401 32.1 27.901 32.1 Q 23.601 32.1 20.351 34.15 Q 17.101 36.2 15.301 39.6 Q 13.501 43 13.501 47.1 Q 13.501 51 15.301 54.45 Q 17.101 57.9 20.351 60 Q 23.601 62.1 27.901 62.1 Z",
"e": "M 52.901 32.201 L 14.001 32.201 Q 15.101 36.801 18.451 39.701 Q 21.801 42.601 26.901 42.601 Q 31.301 42.601 34.551 40.601 Q 37.801 38.601 39.601 35.601 L 50.101 43.501 Q 47.001 48.401 40.801 51.501 Q 34.601 54.601 26.901 54.601 Q 18.901 54.601 12.801 50.901 Q 6.701 47.201 3.351 41.051 Q 0.001 34.901 0.001 27.401 Q 0.001 19.901 3.501 13.651 Q 7.001 7.401 13.051 3.701 Q 19.101 0.001 26.901 0.001 Q 34.701 0.001 40.651 3.701 Q 46.601 7.401 49.951 13.651 Q 53.301 19.901 53.301 27.401 Q 53.301 28.501 53.201 29.701 Q 53.101 30.901 52.901 32.201 Z M 14.001 22.101 L 39.701 22.101 Q 38.601 17.801 35.151 14.701 Q 31.701 11.601 26.701 11.601 Q 21.901 11.601 18.501 14.501 Q 15.101 17.401 14.001 22.101 Z",
"f": "M 20.8 73 L 7.3 73 L 7.3 32.5 L 0 32.5 L 0 21 L 7.3 21 L 7.3 17.5 Q 7.3 9.6 12 4.8 Q 16.7 0 24.6 0 L 30.2 0 L 30.2 11.5 L 26.7 11.5 Q 20.8 11.5 20.8 17.7 L 20.8 21 L 31.4 21 L 31.4 32.5 L 20.8 32.5 L 20.8 73 Z",
"g": "M 2.401 64.802 L 10.801 54.902 Q 14.501 59.102 18.501 60.602 Q 22.501 62.102 27.401 62.102 Q 31.001 62.102 34.101 60.302 Q 37.201 58.502 39.051 55.252 Q 40.901 52.002 40.901 47.902 L 40.901 45.602 Q 38.801 49.202 35.151 51.402 Q 31.501 53.602 25.201 53.602 Q 18.101 53.602 12.351 50.002 Q 6.601 46.402 3.301 40.352 Q 0.001 34.302 0.001 26.802 Q 0.001 19.302 3.301 13.202 Q 6.601 7.102 12.351 3.552 Q 18.101 0.002 25.201 0.002 Q 31.701 0.002 35.351 2.302 Q 39.001 4.602 41.101 8.402 L 41.101 1.302 L 54.401 1.302 L 54.401 48.702 Q 54.401 56.702 50.951 62.502 Q 47.501 68.302 41.401 71.452 Q 35.301 74.602 27.301 74.602 Q 19.401 74.602 13.251 72.452 Q 7.101 70.302 2.401 64.802 Z M 27.401 41.302 Q 34.101 41.302 37.801 37.102 Q 41.501 32.902 41.501 26.802 Q 41.501 20.702 37.801 16.502 Q 34.101 12.302 27.401 12.302 Q 20.801 12.302 17.151 16.502 Q 13.501 20.702 13.501 26.802 Q 13.501 30.702 15.151 34.002 Q 16.801 37.302 19.901 39.302 Q 23.001 41.302 27.401 41.302 Z",
"h": "M 13.5 73 L 0 73 L 0 0 L 13.5 0 L 13.5 28.2 Q 17.7 19.8 29.2 19.8 Q 34.8 19.8 39.3 22.4 Q 43.8 25 46.4 29.8 Q 49 34.6 49 41.2 L 49 73 L 35.5 73 L 35.5 44.5 Q 35.5 37.7 32.4 34.65 Q 29.3 31.6 24.3 31.6 Q 20 31.6 16.75 34.65 Q 13.5 37.7 13.5 44.5 L 13.5 73 Z",
"i": "M 14.9 72.2 L 1.4 72.2 L 1.4 20.2 L 14.9 20.2 L 14.9 72.2 Z M 8.1 15.9 Q 4.7 15.9 2.35 13.55 Q 0 11.2 0 7.9 Q 0 4.7 2.35 2.35 Q 4.7 0 8.1 0 Q 11.6 0 13.9 2.35 Q 16.2 4.7 16.2 7.9 Q 16.2 11.3 13.9 13.6 Q 11.6 15.9 8.1 15.9 Z",
"j": "M 4.4 92.2 L 0 92.2 L 0 80.2 L 2.6 80.2 Q 6.8 80.2 6.8 75.4 L 6.8 20.2 L 20.3 20.2 L 20.3 76.1 Q 20.3 84.6 16.2 88.4 Q 12.1 92.2 4.4 92.2 Z M 13.6 15.9 Q 10.2 15.9 7.85 13.55 Q 5.5 11.2 5.5 7.9 Q 5.5 4.7 7.85 2.35 Q 10.2 0 13.6 0 Q 17.1 0 19.4 2.35 Q 21.7 4.7 21.7 7.9 Q 21.7 11.3 19.4 13.6 Q 17.1 15.9 13.6 15.9 Z",
"k": "M 13.5 73 L 0 73 L 0 0 L 13.5 0 L 13.5 42 L 33 21 L 52.2 21 L 27.7 45.2 L 52.3 73 L 34.4 73 L 13.5 48.3 L 13.5 73 Z",
"l": "M 13.5 73 L 0 73 L 0 0 L 13.5 0 L 13.5 73 Z",
"m": "M 13.5 53.201 L 0 53.201 L 0 1.201 L 13.3 1.201 L 13.3 8.801 Q 17.4 0.001 29.2 0.001 Q 34.7 0.001 39.1 2.551 Q 43.5 5.101 46.1 9.801 Q 48.7 5.101 52.75 2.551 Q 56.8 0.001 63.7 0.001 Q 69.3 0.001 73.8 2.601 Q 78.3 5.201 80.9 10.001 Q 83.5 14.801 83.5 21.401 L 83.5 53.201 L 70 53.201 L 70 24.701 Q 70 17.901 67.1 14.851 Q 64.2 11.801 59.6 11.801 Q 54.9 11.801 51.95 14.501 Q 49 17.201 49 24.701 L 49 53.201 L 35.5 53.201 L 35.5 24.701 Q 35.5 17.901 32.4 14.851 Q 29.3 11.801 24.3 11.801 Q 20 11.801 16.75 14.851 Q 13.5 17.901 13.5 24.701 L 13.5 53.201 Z",
"n": "M 13.5 53.201 L 0 53.201 L 0 1.201 L 13.3 1.201 L 13.3 8.801 Q 17.4 0.001 29.2 0.001 Q 34.8 0.001 39.3 2.601 Q 43.8 5.201 46.4 10.001 Q 49 14.801 49 21.401 L 49 53.201 L 35.5 53.201 L 35.5 24.701 Q 35.5 17.901 32.4 14.851 Q 29.3 11.801 24.3 11.801 Q 20 11.801 16.75 14.851 Q 13.5 17.901 13.5 24.701 L 13.5 53.201 Z",
"o": "M 27.702 54.501 Q 19.702 54.501 13.402 50.801 Q 7.102 47.101 3.552 40.951 Q 0.002 34.801 0.002 27.301 Q 0.002 19.801 3.552 13.601 Q 7.102 7.401 13.402 3.701 Q 19.702 0.001 27.702 0.001 Q 35.802 0.001 42.052 3.701 Q 48.302 7.401 51.852 13.601 Q 55.402 19.801 55.402 27.301 Q 55.402 34.801 51.852 40.951 Q 48.302 47.101 42.052 50.801 Q 35.802 54.501 27.702 54.501 Z M 27.702 42.201 Q 32.002 42.201 35.202 40.151 Q 38.402 38.101 40.152 34.701 Q 41.902 31.301 41.902 27.301 Q 41.902 23.201 40.152 19.801 Q 38.402 16.401 35.202 14.351 Q 32.002 12.301 27.702 12.301 Q 23.402 12.301 20.202 14.351 Q 17.002 16.401 15.252 19.801 Q 13.502 23.201 13.502 27.301 Q 13.502 31.301 15.252 34.701 Q 17.002 38.101 20.202 40.151 Q 23.402 42.201 27.702 42.201 Z",
"p": "M 13.5 73.101 L 0 73.101 L 0 1.101 L 13.3 1.101 L 13.3 9.501 Q 15.4 5.201 19.25 2.601 Q 23.1 0.001 29.9 0.001 Q 35.3 0.001 39.95 2.151 Q 44.6 4.301 48.1 8.051 Q 51.6 11.801 53.6 16.751 Q 55.6 21.701 55.6 27.301 Q 55.6 34.801 52.15 40.951 Q 48.7 47.101 42.9 50.751 Q 37.1 54.401 29.9 54.401 Q 23.2 54.401 19.4 51.951 Q 15.6 49.501 13.5 45.401 L 13.5 73.101 Z M 27.7 42.201 Q 32 42.201 35.25 40.101 Q 38.5 38.001 40.3 34.551 Q 42.1 31.101 42.1 27.201 Q 42.1 23.101 40.3 19.701 Q 38.5 16.301 35.25 14.251 Q 32 12.201 27.7 12.201 Q 23.3 12.201 20 14.301 Q 16.7 16.401 14.9 19.801 Q 13.1 23.201 13.1 27.301 Q 13.1 31.301 14.9 34.701 Q 16.7 38.101 20 40.151 Q 23.3 42.201 27.7 42.201 Z",
"q": "M 55.601 73.1 L 42.101 73.1 L 42.101 45.4 Q 40.001 49.5 36.201 51.95 Q 32.401 54.4 25.701 54.4 Q 18.601 54.4 12.751 50.75 Q 6.901 47.1 3.451 40.95 Q 0.001 34.8 0.001 27.3 Q 0.001 21.7 2.001 16.75 Q 4.001 11.8 7.501 8.05 Q 11.001 4.3 15.651 2.15 Q 20.301 0 25.701 0 Q 32.501 0 36.351 2.6 Q 40.201 5.2 42.301 9.5 L 42.301 1.1 L 55.601 1.1 L 55.601 73.1 Z M 27.901 42.2 Q 32.401 42.2 35.651 40.15 Q 38.901 38.1 40.701 34.7 Q 42.501 31.3 42.501 27.3 Q 42.501 23.2 40.701 19.8 Q 38.901 16.4 35.651 14.3 Q 32.401 12.2 27.901 12.2 Q 23.601 12.2 20.351 14.25 Q 17.101 16.3 15.301 19.7 Q 13.501 23.1 13.501 27.2 Q 13.501 31.1 15.301 34.55 Q 17.101 38 20.351 40.1 Q 23.601 42.2 27.901 42.2 Z",
"r": "M 13.5 53.248 L 0 53.248 L 0 1.248 L 13.1 1.248 L 13.1 11.148 Q 14.4 5.548 18.4 2.598 Q 22.4 -0.352 29.2 0.048 L 29.2 12.748 L 27.3 12.748 Q 21.5 12.748 17.5 16.448 Q 13.5 20.148 13.5 26.648 L 13.5 53.248 Z",
"s": "M 0 45.5 L 9.1 37.2 Q 14.8 43.6 21.3 43.6 Q 24.8 43.6 26.65 42.05 Q 28.5 40.5 28.5 38.2 Q 28.5 36.8 27.85 35.8 Q 27.2 34.8 25.15 33.9 Q 23.1 33 19 32.1 Q 12 30.4 8.6 27.9 Q 5.2 25.4 4.1 22.3 Q 3 19.2 3 15.9 Q 3 9.1 8.15 4.55 Q 13.3 0 22.4 0 Q 28.7 0 33.2 1.9 Q 37.7 3.8 41.7 9 L 31.9 16.5 Q 30 13.5 27.65 12.2 Q 25.3 10.9 22.7 10.9 Q 19.9 10.9 18.05 12 Q 16.2 13.1 16.2 15.5 Q 16.2 16.8 17.4 18.05 Q 18.6 19.3 23.2 20.5 Q 30.8 22.4 34.8 24.95 Q 38.8 27.5 40.3 30.7 Q 41.8 33.9 41.8 37.8 Q 41.8 42.6 39.15 46.4 Q 36.5 50.2 31.95 52.4 Q 27.4 54.6 21.6 54.6 Q 8.5 54.6 0 45.5 Z",
"t": "M 30.6 63.9 L 23.2 63.9 Q 15.5 63.9 11.4 60.1 Q 7.3 56.3 7.3 47.8 L 7.3 23.4 L 0 23.4 L 0 11.9 L 7.3 11.9 L 7.3 1.4 L 20.8 0 L 20.8 11.9 L 31.8 11.9 L 31.8 23.4 L 20.8 23.4 L 20.8 47.1 Q 20.8 51.9 25 51.9 L 30.6 51.9 L 30.6 63.9 Z",
"u": "M 0 31.8 L 0 0 L 13.5 0 L 13.5 28.5 Q 13.5 35.2 16.2 38.3 Q 18.9 41.4 23.9 41.4 Q 28.2 41.4 31.45 38.3 Q 34.7 35.2 34.7 28.5 L 34.7 0 L 48.2 0 L 48.2 52 L 35.1 52 L 35.1 44.2 Q 33.2 48.7 29.55 50.95 Q 25.9 53.2 19.8 53.2 Q 14.2 53.2 9.7 50.6 Q 5.2 48 2.6 43.15 Q 0 38.3 0 31.8 Z",
"v": "M 35.3 52 L 21.7 52 L 0 0 L 16 0 L 26.4 29.7 Q 27.8 33.7 28.6 38 Q 29.4 33.7 30.8 29.7 L 41.2 0 L 56.9 0 L 35.3 52 Z",
"w": "M 31.7 52 L 16.2 52 L 0 0 L 15.8 0 L 22.5 29.5 Q 22.9 31.4 23.35 33.45 Q 23.8 35.5 24.1 37.4 Q 24.7 33.4 25.8 29.4 L 33.4 0 L 48.9 0 L 57 29.4 Q 58.1 33.4 58.7 37.4 Q 59 35.5 59.45 33.45 Q 59.9 31.4 60.3 29.5 L 67.5 0 L 82.2 0 L 66 52 L 51.4 52 L 42.9 22.4 Q 41.7 18.5 41.1 14.6 Q 40.8 16.5 40.4 18.5 Q 40 20.5 39.5 22.4 L 31.7 52 Z",
"x": "M 16.1 52 L 0 52 L 19.5 26 L 1 0 L 17.1 0 L 27.7 16.5 L 38.7 0 L 54.5 0 L 36 26.2 L 55.5 52 L 39.1 52 L 27.8 35.4 L 16.1 52 Z",
"y": "M 1.8 71.9 L 3.8 59 Q 6.6 59.7 9.9 59.7 Q 13.8 59.7 16.3 57.45 Q 18.8 55.2 19.9 51.8 L 20.6 49.6 L 0 0 L 16.3 0 L 26.4 29.7 Q 27.8 33.7 28.6 38 Q 29.4 33.7 30.8 29.7 L 40.9 0 L 56.9 0 L 33.9 55.3 Q 30.6 63.2 25.3 68.05 Q 20 72.9 10.8 72.9 Q 8.8 72.9 6.3 72.7 Q 3.8 72.5 1.8 71.9 Z",
"z": "M 45.4 52 L 0 52 L 0 50.5 L 22.8 14.4 Q 23.7 12.9 25.2 11.2 L 1.1 11.2 L 1.1 0 L 45.9 0 L 45.9 1.5 L 22.9 38.2 Q 22.1 39.4 21 40.8 L 45.4 40.8 L 45.4 52 Z",
"A": "M 15.2 70 L 0 70 L 28.6 0 L 40.7 0 L 69.2 70 L 54 70 L 49.2 56.7 L 20 56.7 L 15.2 70 Z M 32.1 25.5 L 24.6 44.6 L 44.6 44.6 L 37.1 25.5 Q 35.6 21.5 34.6 17.5 Q 33.6 21.8 32.1 25.5 Z",
"B": "M 26.1 70.001 L 0 70.001 L 0 0.001 L 23.6 0.001 Q 35 0.001 41 5.101 Q 47 10.201 47 18.401 Q 47 23.401 44.55 27.051 Q 42.1 30.701 35.7 33.101 Q 44.3 35.101 47.6 39.651 Q 50.9 44.201 50.9 50.701 Q 50.9 59.501 44.2 64.751 Q 37.5 70.001 26.1 70.001 Z M 14 40.301 L 14 57.401 L 24.8 57.401 Q 30.5 57.401 33.6 55.251 Q 36.7 53.101 36.7 48.501 Q 36.7 44.701 33.6 42.501 Q 30.5 40.301 24.8 40.301 L 14 40.301 Z M 14 12.501 L 14 28.901 L 22.3 28.901 Q 28 28.901 30.4 26.851 Q 32.8 24.801 32.8 20.601 Q 32.8 17.001 30.4 14.751 Q 28 12.501 22.3 12.501 L 14 12.501 Z",
"C": "M 62.101 11 L 52.201 19.6 Q 45.901 13 36.501 13 Q 29.801 13 24.851 16.2 Q 19.901 19.4 17.201 24.7 Q 14.501 30 14.501 36.4 Q 14.501 42.8 17.201 48.05 Q 19.901 53.3 24.901 56.45 Q 29.901 59.6 36.801 59.6 Q 41.901 59.6 45.801 57.9 Q 49.701 56.2 52.801 52.8 L 63.001 61.5 Q 59.001 66.3 52.351 69.45 Q 45.701 72.6 36.501 72.6 Q 28.701 72.6 22.051 69.8 Q 15.401 67 10.451 62 Q 5.501 57 2.751 50.45 Q 0.001 43.9 0.001 36.4 Q 0.001 28.9 2.651 22.3 Q 5.301 15.7 10.151 10.7 Q 15.001 5.7 21.701 2.85 Q 28.401 0 36.501 0 Q 45.101 0 51.251 2.7 Q 57.401 5.4 62.101 11 Z",
"D": "M 25 70.001 L 0 70.001 L 0 0.001 L 25 0.001 Q 37.1 0.001 45.05 4.601 Q 53 9.201 56.95 17.101 Q 60.9 25.001 60.9 35.101 Q 60.9 45.101 56.95 53.001 Q 53 60.901 45.05 65.451 Q 37.1 70.001 25 70.001 Z M 23.3 12.601 L 14 12.601 L 14 57.401 L 23.3 57.401 Q 31.6 57.401 36.7 54.451 Q 41.8 51.501 44.1 46.451 Q 46.4 41.401 46.4 35.101 Q 46.4 28.701 44.1 23.651 Q 41.8 18.601 36.7 15.601 Q 31.6 12.601 23.3 12.601 Z",
"E": "M 41.2 70 L 0 70 L 0 0 L 41 0 L 41 12.6 L 14 12.6 L 14 28.3 L 40.5 28.3 L 40.5 40.5 L 14 40.5 L 14 57.4 L 41.2 57.4 L 41.2 70 Z",
"F": "M 14 70 L 0 70 L 0 0 L 41.1 0 L 41.1 12.6 L 14 12.6 L 14 29 L 40.6 29 L 40.6 41.4 L 14 41.4 L 14 70 Z",
"G": "M 62.201 11 L 52.201 19.6 Q 49.401 16.5 45.401 14.75 Q 41.401 13 36.501 13 Q 29.801 13 24.851 16.2 Q 19.901 19.4 17.201 24.7 Q 14.501 30 14.501 36.4 Q 14.501 42.8 17.201 48.1 Q 19.901 53.4 24.851 56.6 Q 29.801 59.8 36.501 59.8 Q 44.801 59.8 49.901 55.85 Q 55.001 51.9 56.201 43.7 L 33.201 43.9 L 33.201 31.3 L 69.701 31.3 Q 69.901 32.9 70.051 35.15 Q 70.201 37.4 70.201 39.1 Q 70.201 48.8 66.151 56.35 Q 62.101 63.9 54.551 68.25 Q 47.001 72.6 36.501 72.6 Q 28.701 72.6 22.051 69.8 Q 15.401 67 10.451 62 Q 5.501 57 2.751 50.45 Q 0.001 43.9 0.001 36.4 Q 0.001 28.9 2.751 22.3 Q 5.501 15.7 10.451 10.7 Q 15.401 5.7 22.051 2.85 Q 28.701 0 36.501 0 Q 45.401 0 51.651 2.85 Q 57.901 5.7 62.201 11 Z",
"H": "M 14 70 L 0 70 L 0 0 L 14 0 L 14 28.2 L 43 28.2 L 43 0 L 57 0 L 57 70 L 43 70 L 43 40.8 L 14 40.8 L 14 70 Z",
"I": "M 14 70 L 0 70 L 0 0 L 14 0 L 14 70 Z",
"J": "M 0 68.4 L 5.3 56.9 Q 7.5 58.5 11.7 58.5 Q 15.2 58.5 17.55 56.75 Q 19.9 55 19.9 50.9 L 19.9 0 L 33.9 0 L 33.9 51.4 Q 33.9 58.2 31.25 62.55 Q 28.6 66.9 24.05 69 Q 19.5 71.1 13.6 71.1 Q 9.5 71.1 5.8 70.4 Q 2.1 69.7 0 68.4 Z",
"K": "M 14 70 L 0 70 L 0 0 L 14 0 L 14 28.9 L 35.8 0 L 54.1 0 L 27 32.8 L 56.1 70 L 38.2 70 L 14 39.1 L 14 70 Z",
"L": "M 40.1 70 L 0 70 L 0 0 L 14 0 L 14 57.4 L 40.1 57.4 L 40.1 70 Z",
"M": "M 13.7 70 L 0 70 L 0 0 L 17.4 0 L 31.9 30.9 Q 34.4 36.3 35.95 39.8 Q 37.5 43.3 38.35 45.6 Q 39.2 47.9 39.7 49.6 Q 40.2 47.9 41 45.6 Q 41.8 43.3 43.35 39.8 Q 44.9 36.3 47.4 30.9 L 62 0 L 78.8 0 L 78.8 70 L 65.1 70 L 65.1 41.7 Q 65.1 36.9 65.2 33.5 Q 65.3 30.1 65.5 27.25 Q 65.7 24.4 66.1 21.4 L 42.8 70 L 36 70 L 12.7 21.4 Q 13.1 24.4 13.3 27.25 Q 13.5 30.1 13.6 33.5 Q 13.7 36.9 13.7 41.7 L 13.7 70 Z",
"N": "M 13 70 L 0 70 L 0 0 L 10.6 0 L 44.7 40.5 Q 45.9 41.9 47.05 43.35 Q 48.2 44.8 49.3 46.3 Q 49 44.1 48.9 41.05 Q 48.8 38 48.8 34.9 L 48.8 0 L 61.6 0 L 61.6 70 L 52.5 70 L 17.1 27.9 Q 15.9 26.5 14.75 25.05 Q 13.6 23.6 12.5 22.1 Q 12.8 24.3 12.9 27.35 Q 13 30.4 13 33.5 L 13 70 Z",
"O": "M 36.501 72.601 Q 28.701 72.601 22.051 69.801 Q 15.401 67.001 10.451 62.001 Q 5.501 57.001 2.751 50.451 Q 0.001 43.901 0.001 36.401 Q 0.001 28.901 2.751 22.301 Q 5.501 15.701 10.451 10.701 Q 15.401 5.701 22.051 2.851 Q 28.701 0.001 36.501 0.001 Q 44.301 0.001 50.901 2.851 Q 57.501 5.701 62.401 10.701 Q 67.301 15.701 70.051 22.301 Q 72.801 28.901 72.801 36.401 Q 72.801 43.901 70.051 50.451 Q 67.301 57.001 62.401 62.001 Q 57.501 67.001 50.901 69.801 Q 44.301 72.601 36.501 72.601 Z M 36.501 59.601 Q 43.301 59.601 48.151 56.451 Q 53.001 53.301 55.651 48.001 Q 58.301 42.701 58.301 36.401 Q 58.301 30.001 55.651 24.701 Q 53.001 19.401 48.151 16.201 Q 43.301 13.001 36.501 13.001 Q 29.701 13.001 24.751 16.201 Q 19.801 19.401 17.151 24.701 Q 14.501 30.001 14.501 36.401 Q 14.501 42.701 17.151 48.001 Q 19.801 53.301 24.751 56.451 Q 29.701 59.601 36.501 59.601 Z",
"P": "M 14 70.001 L 0 70.001 L 0 0.001 L 23.6 0.001 Q 35.4 0.001 42.15 5.551 Q 48.9 11.101 48.9 22.101 Q 48.9 33.201 42.15 38.901 Q 35.4 44.601 23.6 44.601 L 14 44.601 L 14 70.001 Z M 14 12.501 L 14 32.001 L 22.8 32.001 Q 28.5 32.001 31.6 29.601 Q 34.7 27.201 34.7 22.201 Q 34.7 17.201 31.6 14.851 Q 28.5 12.501 22.8 12.501 L 14 12.501 Z",
"Q": "M 61.901 62.501 L 71.501 77.001 L 56.301 77.001 L 51.301 69.601 Q 47.901 71.001 44.201 71.801 Q 40.501 72.601 36.501 72.601 Q 28.701 72.601 22.051 69.801 Q 15.401 67.001 10.451 62.001 Q 5.501 57.001 2.751 50.451 Q 0.001 43.901 0.001 36.401 Q 0.001 28.901 2.751 22.301 Q 5.501 15.701 10.451 10.701 Q 15.401 5.701 22.051 2.851 Q 28.701 0.001 36.501 0.001 Q 44.301 0.001 50.901 2.851 Q 57.501 5.701 62.401 10.701 Q 67.301 15.701 70.051 22.301 Q 72.801 28.901 72.801 36.401 Q 72.801 44.101 69.901 50.851 Q 67.001 57.601 61.901 62.501 Z M 44.601 58.201 L 36.201 45.501 L 51.401 45.501 L 54.501 50.101 Q 58.301 44.201 58.301 36.401 Q 58.301 30.001 55.651 24.701 Q 53.001 19.401 48.151 16.201 Q 43.301 13.001 36.501 13.001 Q 29.701 13.001 24.751 16.201 Q 19.801 19.401 17.151 24.701 Q 14.501 30.001 14.501 36.401 Q 14.501 42.701 17.151 48.001 Q 19.801 53.301 24.751 56.451 Q 29.701 59.601 36.501 59.601 Q 40.901 59.601 44.601 58.201 Z",
"R": "M 14 70.001 L 0 70.001 L 0 0.001 L 22.6 0.001 Q 34.4 0.001 41.15 5.451 Q 47.9 10.901 47.9 21.201 Q 47.9 29.501 43.45 34.601 Q 39 39.701 31.1 41.401 L 50.7 70.001 L 34.2 70.001 L 19.3 47.801 Q 17.9 45.701 16.6 42.701 L 14 42.701 L 14 70.001 Z M 14 12.601 L 14 30.101 L 21.8 30.101 Q 27.5 30.101 30.6 27.851 Q 33.7 25.601 33.7 21.301 Q 33.7 17.101 30.6 14.851 Q 27.5 12.601 21.8 12.601 L 14 12.601 Z",
"S": "M 0 57.401 L 12.1 49.701 Q 14.8 55.101 18.9 57.551 Q 23 60.001 27.6 60.001 Q 32.5 60.001 35.3 57.801 Q 38.1 55.601 38.1 52.001 Q 38.1 48.501 35.9 46.401 Q 33.7 44.301 30.05 43.001 Q 26.4 41.701 22.1 40.601 Q 14 38.501 9.2 33.651 Q 4.4 28.801 4.4 20.901 Q 4.4 14.601 7.5 9.901 Q 10.6 5.201 16.15 2.601 Q 21.7 0.001 29.1 0.001 Q 37.3 0.001 42.8 3.401 Q 48.3 6.801 52.2 13.001 L 40.2 20.401 Q 37.7 16.301 35 14.401 Q 32.3 12.501 28.4 12.501 Q 24.2 12.501 21.45 14.601 Q 18.7 16.701 18.7 20.201 Q 18.7 24.101 21.95 25.851 Q 25.2 27.601 29.8 29.001 Q 32.9 30.001 36.75 31.351 Q 40.6 32.701 44.2 35.051 Q 47.8 37.401 50.1 41.301 Q 52.4 45.201 52.4 51.201 Q 52.4 57.501 49.3 62.301 Q 46.2 67.101 40.5 69.801 Q 34.8 72.501 26.8 72.501 Q 18.5 72.501 11.55 68.951 Q 4.6 65.401 0 57.401 Z",
"T": "M 34 70 L 20 70 L 20 12.6 L 0 12.6 L 0 0 L 54 0 L 54 12.6 L 34 12.6 L 34 70 Z",
"U": "M 0 44.1 L 0 0 L 14 0 L 14 42.6 Q 14 50 17.55 54.25 Q 21.1 58.5 28.3 58.5 Q 35.5 58.5 39.05 54.25 Q 42.6 50 42.6 42.6 L 42.6 0 L 56.6 0 L 56.6 44.1 Q 56.6 52.1 53.1 58.25 Q 49.6 64.4 43.25 67.85 Q 36.9 71.3 28.3 71.3 Q 19.8 71.3 13.4 67.85 Q 7 64.4 3.5 58.25 Q 0 52.1 0 44.1 Z",
"V": "M 41.4 70 L 27.9 70 L 0 0 L 16.2 0 L 32.2 44.5 Q 33.8 48.9 34.7 53.3 Q 35.2 51.1 35.8 48.85 Q 36.4 46.6 37.2 44.5 L 53.2 0 L 69.1 0 L 41.4 70 Z",
"W": "M 36 70 L 23.4 70 L 0 0 L 16 0 L 27.2 39.6 Q 28.1 42.6 28.85 45.65 Q 29.6 48.7 30 51.6 Q 30.4 48.7 31.1 45.6 Q 31.8 42.5 32.9 39.6 L 46.8 0 L 59.4 0 L 73.3 39.6 Q 75.5 45.7 76.4 51.6 Q 76.8 48.7 77.45 45.65 Q 78.1 42.6 79 39.6 L 90.2 0 L 106.2 0 L 82.8 70 L 70.2 70 L 56 30.5 Q 54 25 53.1 19 Q 52.6 21.9 51.9 24.8 Q 51.2 27.7 50.2 30.5 L 36 70 Z",
"X": "M 16.6 70 L 0 70 L 23 34.9 L 1.1 0 L 17.8 0 L 31.6 23.2 L 45.7 0 L 62 0 L 40.1 35.2 L 63.1 70 L 46.2 70 L 31.6 46.7 L 16.6 70 Z",
"Y": "M 37.7 70 L 23.7 70 L 23.7 41.9 L 0 0 L 15.4 0 L 26.4 20.1 Q 27.7 22.5 29.05 25.1 Q 30.4 27.7 31.1 30.3 Q 31.8 27.7 33.05 25.15 Q 34.3 22.6 35.6 20.1 L 46.1 0 L 61.4 0 L 37.7 42.2 L 37.7 70 Z",
"Z": "M 56.4 70 L 0 70 L 0 68.5 L 31.8 15.5 Q 32.8 13.8 34.1 12.3 L 1.9 12.3 L 1.9 0 L 56.4 0 L 56.4 1.5 L 24.6 54.5 Q 23.6 56.2 22.3 57.7 L 56.4 57.7 L 56.4 70 Z",
"0": "M 0.001 45.201 L 0.001 27.201 Q 0.001 19.701 3.451 13.551 Q 6.901 7.401 13.051 3.701 Q 19.201 0.001 27.201 0.001 Q 35.301 0.001 41.401 3.701 Q 47.501 7.401 50.951 13.551 Q 54.401 19.701 54.401 27.201 L 54.401 45.201 Q 54.401 52.701 50.951 58.851 Q 47.501 65.001 41.401 68.701 Q 35.301 72.401 27.201 72.401 Q 19.201 72.401 13.051 68.701 Q 6.901 65.001 3.451 58.851 Q 0.001 52.701 0.001 45.201 Z M 39.901 43.601 L 39.901 28.901 Q 39.901 21.301 36.801 17.151 Q 33.701 13.001 27.201 13.001 Q 20.801 13.001 17.651 17.151 Q 14.501 21.301 14.501 28.901 L 14.501 43.601 Q 14.501 50.401 17.651 54.901 Q 20.801 59.401 27.201 59.401 Q 33.701 59.401 36.801 54.901 Q 39.901 50.401 39.901 43.601 Z",
"1": "M 26.1 70 L 12.1 70 L 12.1 15.6 L 0 15.6 L 0 14.1 L 12.1 0 L 26.1 0 L 26.1 70 Z",
"2": "M 49.901 71.301 L 0.001 71.301 L 0.001 69.701 L 28.001 36.701 Q 31.201 33.001 33.101 29.651 Q 35.001 26.301 35.001 23.101 Q 35.001 18.601 32.301 15.801 Q 29.601 13.001 24.701 13.001 Q 19.801 13.001 17.151 15.951 Q 14.501 18.901 14.501 24.301 L 0.001 24.301 Q 0.001 17.101 3.251 11.601 Q 6.501 6.101 12.101 3.051 Q 17.701 0.001 24.901 0.001 Q 32.201 0.001 37.701 3.001 Q 43.201 6.001 46.351 11.051 Q 49.501 16.101 49.501 22.301 Q 49.501 26.501 48.201 30.251 Q 46.901 34.001 43.401 38.401 L 32.501 52.601 Q 31.201 54.301 29.651 56.001 Q 28.101 57.701 26.301 59.001 L 49.901 59.001 L 49.901 71.301 Z",
"3": "M 0.001 50.4 L 14.001 50.4 Q 14.001 55.7 16.851 58.1 Q 19.701 60.5 24.701 60.5 Q 29.701 60.5 32.101 57.9 Q 34.501 55.3 34.501 51.8 Q 34.501 46.5 31.251 43.8 Q 28.001 41.1 22.801 41.1 L 15.701 41.1 L 15.701 29.7 L 22.801 29.7 Q 27.901 29.7 30.951 27.45 Q 34.001 25.2 34.001 20.8 Q 34.001 17.2 31.751 14.65 Q 29.501 12.1 24.701 12.1 Q 20.001 12.1 17.201 14.35 Q 14.401 16.6 14.401 21.3 L 0.901 21.3 Q 0.901 11.2 7.401 5.6 Q 13.901 0 24.701 0 Q 32.001 0 37.051 2.7 Q 42.101 5.4 44.801 9.95 Q 47.501 14.5 47.501 20.2 Q 47.501 25.1 45.551 28.9 Q 43.601 32.7 39.201 34.9 Q 43.601 37.3 46.001 41.65 Q 48.401 46 48.401 52.5 Q 48.401 58.1 45.601 62.7 Q 42.801 67.3 37.551 69.95 Q 32.301 72.6 24.701 72.6 Q 13.501 72.6 6.751 66.9 Q 0.001 61.2 0.001 50.4 Z",
"4": "M 47.8 70 L 33.8 70 L 33.8 52.1 L 0 52.1 L 0 47.6 L 35.9 0 L 47.8 0 L 47.8 40.9 L 55.8 40.9 L 55.8 52.1 L 47.8 52.1 L 47.8 70 Z M 33.9 40.9 L 33.9 31.5 Q 33.9 29.6 33.95 26.1 Q 34 22.6 34.3 19.8 Q 33.3 21.5 32.25 23.1 Q 31.2 24.7 30.1 26.1 L 18.7 40.9 L 33.9 40.9 Z",
"5": "M 0 65.9 L 5.1 53.7 Q 8.4 55.6 12.4 56.95 Q 16.4 58.3 21 58.3 Q 27.9 58.3 31.25 55.3 Q 34.6 52.3 34.6 47.3 Q 34.6 42.3 31.3 39.05 Q 28 35.8 20 35.8 Q 15.7 35.8 11.75 36.95 Q 7.8 38.1 3.8 40.2 L 10.3 0 L 43.5 0 L 43.5 12.3 L 21.2 12.3 L 19.3 24.7 Q 20.8 24.2 22.25 24.1 Q 23.7 24 25.2 24 Q 33.6 24 38.85 27.3 Q 44.1 30.6 46.6 35.9 Q 49.1 41.2 49.1 47.3 Q 49.1 54.2 45.7 59.65 Q 42.3 65.1 36.2 68.2 Q 30.1 71.3 22 71.3 Q 16.2 71.3 11 70.2 Q 5.8 69.1 0 65.9 Z",
"6": "M 5.6 30.2 L 25.5 0 L 41.8 0 L 25.6 24.6 Q 33.4 23.9 39.2 26.6 Q 45 29.3 48.2 34.7 Q 51.4 40.1 51.4 47.3 Q 51.4 54.2 48.1 59.65 Q 44.8 65.1 39 68.2 Q 33.2 71.3 25.6 71.3 Q 18.1 71.3 12.3 68.2 Q 6.5 65.1 3.25 59.65 Q 0 54.2 0 47.3 Q 0 43.5 0.95 39.6 Q 1.9 35.7 5.6 30.2 Z M 25.6 58.3 Q 31 58.3 33.95 55.05 Q 36.9 51.8 36.9 47.3 Q 36.9 44.3 35.6 41.6 Q 34.3 38.9 31.8 37.2 Q 29.3 35.5 25.7 35.5 Q 22.2 35.5 19.65 37.2 Q 17.1 38.9 15.8 41.6 Q 14.5 44.3 14.5 47.3 Q 14.5 51.8 17.45 55.05 Q 20.4 58.3 25.6 58.3 Z",
"7": "M 19.7 70 L 4.7 70 L 30.5 15.5 Q 31.2 14 32.5 12.3 L 0 12.3 L 0 0 L 52.5 0 L 52.7 1.5 L 19.7 70 Z",
"8": "M 24.201 72.6 Q 16.701 72.6 11.251 69.95 Q 5.801 67.3 2.901 62.7 Q 0.001 58.1 0.001 52.5 Q 0.001 45.9 2.901 41.55 Q 5.801 37.2 10.201 34.9 Q 6.301 32.6 4.151 28.8 Q 2.001 25 2.001 19.9 Q 2.001 14.2 4.551 9.7 Q 7.101 5.2 12.051 2.6 Q 17.001 0 24.201 0 Q 31.501 0 36.401 2.6 Q 41.301 5.2 43.851 9.7 Q 46.401 14.2 46.401 19.9 Q 46.401 30.1 38.201 34.9 Q 42.601 37.3 45.501 41.6 Q 48.401 45.9 48.401 52.5 Q 48.401 58.1 45.501 62.7 Q 42.601 67.3 37.201 69.95 Q 31.801 72.6 24.201 72.6 Z M 24.201 60.6 Q 28.701 60.6 31.651 57.65 Q 34.601 54.7 34.601 50.7 Q 34.601 46.3 31.651 43.45 Q 28.701 40.6 24.201 40.6 Q 19.701 40.6 16.751 43.45 Q 13.801 46.3 13.801 50.7 Q 13.801 54.7 16.751 57.65 Q 19.701 60.6 24.201 60.6 Z M 24.201 29.5 Q 28.101 29.5 30.551 26.95 Q 33.001 24.4 33.101 20.5 Q 33.201 16.9 30.751 14.45 Q 28.301 12 24.201 12 Q 20.301 12 17.851 14.45 Q 15.401 16.9 15.401 20.5 Q 15.401 24.4 17.851 26.95 Q 20.301 29.5 24.201 29.5 Z",
"9": "M 25.801 71.301 L 9.501 71.301 L 25.801 46.701 Q 17.901 47.401 12.101 44.701 Q 6.301 42.001 3.151 36.601 Q 0.001 31.201 0.001 24.001 Q 0.001 17.001 3.301 11.601 Q 6.601 6.201 12.451 3.101 Q 18.301 0.001 25.801 0.001 Q 33.401 0.001 39.151 3.101 Q 44.901 6.201 48.151 11.601 Q 51.401 17.001 51.401 24.001 Q 51.401 27.801 50.451 31.651 Q 49.501 35.501 45.801 41.101 L 25.801 71.301 Z M 25.701 35.801 Q 29.301 35.801 31.801 34.101 Q 34.301 32.401 35.601 29.701 Q 36.901 27.001 36.901 24.001 Q 36.901 19.501 34.001 16.251 Q 31.101 13.001 25.801 13.001 Q 20.401 13.001 17.451 16.251 Q 14.501 19.501 14.501 24.001 Q 14.501 27.001 15.801 29.701 Q 17.101 32.401 19.651 34.101 Q 22.201 35.801 25.701 35.801 Z",
};

// Color utility functions
const ColorUtils = {
    // Parse color string to RGB
    parseColor: function(colorStr) {
        colorStr = colorStr.trim();
        // Handle hex colors
        if (colorStr.startsWith('#')) {
            const hex = colorStr.slice(1);
            if (hex.length === 3) {
                return [
                    parseInt(hex[0] + hex[0], 16),
                    parseInt(hex[1] + hex[1], 16),
                    parseInt(hex[2] + hex[2], 16)
                ];
            } else if (hex.length === 6) {
                return [
                    parseInt(hex.slice(0, 2), 16),
                    parseInt(hex.slice(2, 4), 16),
                    parseInt(hex.slice(4, 6), 16)
                ];
            }
        }
        // Handle named colors using PALETTE
        const normName = colorStr.replace(/\s+/g, '').toLowerCase();
        const hex = PALETTE[normName];
        console.log({ normName, hex});
        if (hex) {
            return [
                parseInt(hex.slice(1, 3), 16),
                parseInt(hex.slice(3, 5), 16),
                parseInt(hex.slice(5, 7), 16)
            ];
        }
        return null; // Not found
    },
    // Convert RGB to hex
    rgbToHex: function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    arrayToPaperColor: function(arr) {
        return new paper.Color(arr[0] / 255, arr[1] / 255, arr[2] / 255);
    },
    namedColors: {
        'black': [0, 0, 0],
        'white': [255, 255, 255],
        'red': [255, 0, 0],
        'green': [0, 128, 0],
        'blue': [0, 0, 255],
        'yellow': [255, 255, 0],
        'cyan': [0, 255, 255],
        'magenta': [255, 0, 255],
        'orange': [255, 165, 0],
        'purple': [128, 0, 128],
        'pink': [255, 192, 203],
        'brown': [165, 42, 42],
        'gray': [128, 128, 128],
        'grey': [128, 128, 128],
        'goldenrod': [218, 165, 32],
        'lime': [0, 255, 0],
        'navy': [0, 0, 128],
        'olive': [128, 128, 0],
        'silver': [192, 192, 192],
        'teal': [0, 128, 128]
    }
};

// Add normalise function
function normalise(key) {
    if (key === 'bg' || key === 'default') return key;
    return key.split('').sort().join('');
}

// --- Chevrotain Color Config Grammar ---
// Tokens
const Key = createToken({ name: 'Key', pattern: /[a-zA-Z]+/ });
const BG = createToken({ name: 'BG', pattern: /bg/ });
const Default = createToken({ name: 'Default', pattern: /default/ });
const HexColor = createToken({ name: 'HexColor', pattern: /#[0-9a-fA-F]{3,6}/ });
const Comma = createToken({ name: 'Comma', pattern: /,/ });
const Colon = createToken({ name: 'Colon', pattern: /:/ });
const Semi = createToken({ name: 'Semi', pattern: /;/ });
const WS = createToken({ name: 'WS', pattern: /[ \t\n\r]+/, group: Lexer.SKIPPED });

const allTokens = [WS, BG, Default, Key, HexColor, Comma, Colon, Semi];
const ColorConfigLexer = new Lexer(allTokens);

// Parser
class ColorConfigParser extends CstParser {
    constructor() {
        super(allTokens, { recoveryEnabled: true });
        const $ = this;
        $.RULE('config', () => {
            $.MANY(() => {
                $.SUBRULE($.pair);
            });
        });
        // keyList: one or more keys (bg, default, or Key), separated by commas
        $.RULE('keyList', () => {
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.OR([
                        { ALT: () => $.CONSUME(BG) },
                        { ALT: () => $.CONSUME(Default) },
                        { ALT: () => $.CONSUME(Key) }
                    ]);
                }
            });
        });
        $.RULE('pair', () => {
            $.SUBRULE($.keyList);
            $.CONSUME(Colon);
            $.OR2([
                { ALT: () => $.CONSUME(HexColor) },
                { ALT: () => $.CONSUME2(Key) } // Use CONSUME2 for color name
            ]);
            $.OPTION(() => {
                $.CONSUME(Semi);
            });
        });
        this.performSelfAnalysis();
    }
}
const parserInstance = new ColorConfigParser();

// Visitor to extract config
const BaseVisitor = parserInstance.getBaseCstVisitorConstructor();
class ColorConfigVisitor extends BaseVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }
    config(ctx) {
        if (!ctx.pair) return [];
        return ctx.pair.map(pair => this.visit(pair));
    }
    keyList(ctx) {
        // Collect all keys (bg, default, or Key)
        const keys = [];
        if (ctx.BG) ctx.BG.forEach(tok => keys.push('bg'));
        if (ctx.Default) ctx.Default.forEach(tok => keys.push('default'));
        if (ctx.Key) ctx.Key.forEach(tok => keys.push(tok.image));
        return keys;
    }
    pair(ctx) {
        const keys = this.visit(ctx.keyList);
        let value = null;
        if (ctx.HexColor) {
            value = ctx.HexColor[0].image;
        } else if (ctx.Key && ctx.Key[0]) {
            value = ctx.Key[0].image;
        } else {
            value = '<color not parsed>';
        }
        return { keys, value };
    }
}
const visitorInstance = new ColorConfigVisitor();

// --- Enhanced parseColorConfig using Chevrotain ---
function parseColorConfigWithErrors(configStr) {
    const lexResult = ColorConfigLexer.tokenize(configStr);
    parserInstance.input = lexResult.tokens;
    const cst = parserInstance.config();
    const errors = [...lexResult.errors, ...parserInstance.errors];
    let config = {};
    if (errors.length === 0) {
        // Extract config
        const pairs = visitorInstance.visit(cst);
        pairs.forEach(({ keys, value }) => {
            // Try to parse the color
            const colorArr = ColorUtils.parseColor(value);
            // If parseColor returns default gray, treat as error
            if (!Array.isArray(colorArr))
            {
                errors.push({
                    message: `Unrecognized color: '${value}' for key(s): ${keys.join(', ')}`
                });
            } else {
                keys.forEach(key => {
                    config[normalise(key)] = colorArr;
                });
            }
        });
    }
    return { config, errors };
}

// --- UI Integration for Error Reporting ---
function updateColorConfigError(errors) {
    const errorDiv = document.getElementById('colorConfigError');
    if (!errors || errors.length === 0) {
        errorDiv.textContent = '';
        return;
    }
    // Show first error, or all
    errorDiv.innerHTML = errors.map(e =>
        e.message ? `${e.message} (at offset ${e.offset ?? ''})` : e.toString()
    ).join('<br>');
}

// --- Debounce utility ---
function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// --- Hook up colorConfig textarea to parser and error reporting ---
const colorConfigTextarea = document.getElementById('colorConfig');
if (colorConfigTextarea) {
    colorConfigTextarea.addEventListener('input', () => {
        const { errors } = parseColorConfigWithErrors(colorConfigTextarea.value);
        updateColorConfigError(errors);
    });
    // Debounced art generation
    colorConfigTextarea.addEventListener('input', debounce(generateArt, 250));
}

// --- Replace old parseColorConfig with Chevrotain version ---
function parseColorConfig(configStr) {
    const { config, errors } = parseColorConfigWithErrors(configStr);
    if (errors.length > 0) throw new Error(errors.map(e => e.message || e.toString()).join('\n'));
    return config;
}

// 2. Function to create a positioned/scaled letter
function generateLetterPath(letter, x, y, size) {
    const pathData = LETTER_PATHS[letter];
    if (!pathData) return null;
    // Create Paper.js path at origin
    const path = new paper.CompoundPath({ pathData, fillColor: null, closed: true });
    // Compute bounding box of the path
    const bounds = path.bounds;
    // Scale to desired size
    const scale = size / Math.max(bounds.width, bounds.height);
    path.scale(scale);
    // Move to (x, y) (centered)
    path.position = new paper.Point(x + size / 2, y + size / 2);
    return path;
}

function clearPaperCanvas(container) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    return canvas;
}

function getParamsFromUI() {
    return {
        colorConfig: document.getElementById('colorConfig').value,
        fontSize: document.getElementById('fontSize').value,
        circleDiameter: document.getElementById('circleDiameter').value,
        canvasSize: document.getElementById('canvasSize').value
    };
}

function setParamsToUI(params) {
    if (params.colorConfig !== undefined) document.getElementById('colorConfig').value = params.colorConfig;
    if (params.fontSize !== undefined) document.getElementById('fontSize').value = params.fontSize;
    if (params.circleDiameter !== undefined) document.getElementById('circleDiameter').value = params.circleDiameter;
    if (params.canvasSize !== undefined) document.getElementById('canvasSize').value = params.canvasSize;
    // Update slider labels
    document.getElementById('fontSizeValue').textContent = document.getElementById('fontSize').value + 'px';
    document.getElementById('circleDiameterValue').textContent = document.getElementById('circleDiameter').value + '%';
}

function encodeParamsToHash(params) {
    const json = JSON.stringify(params);
    return btoa(encodeURIComponent(json));
}

function decodeParamsFromHash(hash) {
    try {
        const json = decodeURIComponent(atob(hash));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

function updateHashFromUI() {
    const params = getParamsFromUI();
    window.location.hash = '#' + encodeParamsToHash(params);
}

function loadParamsFromHash() {
    if (window.location.hash && window.location.hash.length > 1) {
        const hash = window.location.hash.slice(1);
        const params = decodeParamsFromHash(hash);
        if (params) {
            setParamsToUI(params);
            return true;
        }
    }
    return false;
}

function getAllNonEmptySubsets(array) {
    // Returns all non-empty subsets of array
    const result = [];
    const n = array.length;
    for (let i = 1; i < (1 << n); i++) {
        const subset = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) subset.push(array[j]);
        }
        result.push(subset);
    }
    return result;
}

function generateArt() {
    // Update hash for sharing
    updateHashFromUI();
    const configStr = document.getElementById('colorConfig').value;
    const fontSize = parseInt(document.getElementById('fontSize').value);
    const circleDiameterPercent = parseInt(document.getElementById('circleDiameter').value);
    const canvasSize = document.getElementById('canvasSize').value;
    const [width, height] = canvasSize.split('x').map(Number);
    const { config: colors, errors: parseErrors } = parseColorConfigWithErrors(configStr);
    let errors = parseErrors ? [...parseErrors] : [];

    if (!colors.bg) {
        // alert('Please specify a background color (bg: colorname)');
        errors.push({ message: 'Please specify a background color (bg: colorname)' });
        updateColorConfigError(errors);
        return;
    }
    // Only use letters for which we have a path
    const letters = Object.keys(colors)
        .filter(key => key !== 'bg' && key.length === 1 && LETTER_PATHS[key])
        .sort();
    if (letters.length === 0) {
        // alert('Please specify at least one letter with a color (and ensure a path exists for it)');
        errors.push({ message: 'Please specify at least one letter with a color (and ensure a path exists for it)' });
        updateColorConfigError(errors);
        return;
    }
    // Prepare Paper.js canvas
    const svgContainer = document.getElementById('svgContainer');
    svgContainer.style.minHeight = height + 'px';
    svgContainer.style.minWidth = width + 'px';
    const canvas = clearPaperCanvas(svgContainer);
    paper.setup(canvas);
    // Background
    const bgRect = new paper.Path.Rectangle({
        point: [0, 0],
        size: [width, height],
        fillColor: ColorUtils.arrayToPaperColor(colors.bg)
    });
    // Calculate circle diameter and center
    const diameter = (Math.min(width, height) * circleDiameterPercent) / 100;
    const radius = diameter / 2;
    const cx = width / 2;
    const cy = height / 2;
    // Place letters evenly around the circle
    const letterShapes = [];
    letters.forEach((letter, index) => {
        const angle = (2 * Math.PI * index) / letters.length;
        const x = cx + radius * Math.cos(angle) - fontSize / 2;
        const y = cy + radius * Math.sin(angle) - fontSize / 2;
        const path = generateLetterPath(letter, x, y, fontSize);
        if (path) {
            letterShapes.push({ letter, path });
        }
    });
    // Compute all non-empty regions
    const regions = [];
    const subsets = getAllNonEmptySubsets(letterShapes);
    for (const subset of subsets) {
        // 1. Intersect all paths in subset
        let region = subset[0].path.clone();
        for (let i = 1; i < subset.length; i++) {
            region = region.intersect(subset[i].path);
        }
        // 2. Subtract all other letter paths
        const otherLetters = letterShapes.filter(ls => !subset.includes(ls));
        for (const other of otherLetters) {
            region = region.subtract(other.path);
        }
        if (!region.isEmpty()) {
            // Region key is sorted concatenation of subset letters
            const key = subset.map(ls => ls.letter).sort().join('');
            regions.push({ key, path: region });
        }
    }
    // Debug: log region keys
    console.log('Region keys:', regions.map(r => r.key));
    // Fill regions and collect missing overlap codes
    const missingOverlapCodes = new Set();
    regions.forEach(region => {
        const normKey = normalise(region.key);
        let colorArr = null;
        if (colors[normKey]) {
            colorArr = colors[normKey];
        } else if (colors.default) {
            colorArr = colors.default;
            missingOverlapCodes.add(region.key);
        } else {
            colorArr = [136, 136, 136];
            missingOverlapCodes.add(region.key);
        }
        region.path.fillColor = ColorUtils.arrayToPaperColor(colorArr);
        region.path.strokeColor = null;
    });
    // Draw background region (subtract all letters)
    let bgRegion = bgRect.clone();
    letterShapes.forEach(ls => {
        bgRegion = bgRegion.subtract(ls.path);
    });
    if (!bgRegion.isEmpty()) {
        bgRegion.fillColor = ColorUtils.arrayToPaperColor(colors.bg);
        bgRegion.strokeColor = null;
    }
    // Show color info
    displayColorInfo(colors, regions);
    // Add missing overlap code errors (distinct)
    if (missingOverlapCodes.size > 0) {
        missingOverlapCodes.forEach(code => {
            errors.push({ message: `Missing overlap code: '${code}' (add a color for this region)` });
        });
    }
    // Deduplicate errors by message
    if (errors.length > 0) {
        const seen = new Set();
        errors = errors.filter(e => {
            if (seen.has(e.message)) return false;
            seen.add(e.message);
            return true;
        });
        updateColorConfigError(errors);
    } else {
        updateColorConfigError([]);
    }
}

function displayColorInfo(colors, regions) {
    const colorInfo = document.getElementById('colorInfo');
    const colorList = document.getElementById('colorList');
    let html = '<div class="color-list">';
    // Background color
    html += `<div class="color-item">
        <span class="color-swatch" style="background-color: ${ColorUtils.rgbToHex(...colors.bg)}"></span>
        <span>Background: ${ColorUtils.rgbToHex(...colors.bg)}</span>
    </div>`;
    // Letter colors
    Object.keys(colors).forEach(key => {
        if (key !== 'bg' && key.length === 1) {
            html += `<div class="color-item">
                <span class="color-swatch" style="background-color: ${ColorUtils.rgbToHex(...colors[key])}"></span>
                <span>Letter ${key}: ${ColorUtils.rgbToHex(...colors[key])}</span>
            </div>`;
        }
    });
    // Overlap colors
    Object.keys(colors).forEach(key => {
        if (key.length > 1 && key !== 'default') {
            html += `<div class="color-item">
                <span class="color-swatch" style="background-color: ${ColorUtils.rgbToHex(...colors[key])}"></span>
                <span>Overlap ${key}: ${ColorUtils.rgbToHex(...colors[key])}</span>
            </div>`;
        }
    });
    // Default color
    if (colors.default) {
        html += `<div class="color-item">
            <span class="color-swatch" style="background-color: ${ColorUtils.rgbToHex(...colors.default)}"></span>
            <span>Default: ${ColorUtils.rgbToHex(...colors.default)}</span>
        </div>`;
    }
    html += '</div>';
    colorList.innerHTML = html;
    colorInfo.style.display = 'block';
}

function downloadSVG() {
    // Export Paper.js project as SVG
    const svg = paper.project.exportSVG({ asString: true });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'classy-abstract.svg';
    a.click();
    URL.revokeObjectURL(url);
}

// --- Color Search UI Integration ---
function renderColorSearchGrid(filter = '') {
    const grid = document.getElementById('colorSearchGrid');
    if (!grid) return;
    const search = filter.trim().toLowerCase();
    // Filter palette keys
    const matches = Object.entries(PALETTE)
        .filter(([name]) => name.includes(search));
    grid.innerHTML = matches.map(([name, hex]) => `
        <div class="color-swatch-search" 
            title="${name}" 
            data-name="${name}" 
            style="background:${hex}; width:28px; height:28px; border-radius:4px; cursor:pointer; border:1px solid #ccc; box-sizing:border-box; display:inline-block;">
        </div>
    `).join('');
}

function setupColorSearch() {
    const box = document.getElementById('colorSearchBox');
    if (!box) return;
    const debounced = debounce(() => {
        renderColorSearchGrid(box.value);
    }, 200);
    box.addEventListener('input', debounced);
    // Click to copy
    document.getElementById('colorSearchGrid').addEventListener('click', e => {
        const swatch = e.target.closest('.color-swatch-search');
        if (swatch) {
            const name = swatch.getAttribute('data-name');
            navigator.clipboard.writeText(name);
            swatch.style.outline = '2px solid #333';
            setTimeout(() => { swatch.style.outline = ''; }, 400);
        }
    });
    renderColorSearchGrid(''); // Show all on load
}

document.addEventListener('DOMContentLoaded', function() {
    setupColorSearch();
    if (!loadParamsFromHash()) {
        generateArt();
    } else {
        generateArt();
    }
});

document.querySelector('.generate-btn').addEventListener('click', generateArt);
document.getElementById('downloadBtn').addEventListener('click', downloadSVG);

// --- Auto-generate on control changes ---
const fontSizeInput = document.getElementById('fontSize');
const circleDiameterInput = document.getElementById('circleDiameter');
const canvasSizeInput = document.getElementById('canvasSize');
const debouncedGenerate = debounce(generateArt, 250);
if (fontSizeInput) fontSizeInput.addEventListener('input', debouncedGenerate);
if (circleDiameterInput) circleDiameterInput.addEventListener('input', debouncedGenerate);
if (canvasSizeInput) canvasSizeInput.addEventListener('change', debouncedGenerate);

// --- Listen for hash changes to update the page ---
window.addEventListener('hashchange', () => {
    if (loadParamsFromHash()) {
        generateArt();
    }
});