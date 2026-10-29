/* Comprime os vídeos (Reels) para o site e cria a capa de cada um.
   Uso: cd site/scripts && npm run videos -- <arquivo.mp4> <nome-no-site> [segundo da capa]
   Ex.:  npm run videos -- "../../videos/aprovacao.mp4" aprovacao-joao 3
   Precisa do ffmpeg instalado. Depois acrescente o vídeo em
   data/config.js > videos e rode  npm run gerar. */
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [origem, nome, capa = "2"] = process.argv.slice(2);
if (!origem || !nome) { console.log("Uso: npm run videos -- <arquivo.mp4> <nome-no-site> [segundo da capa]"); process.exit(1); }
const destino = path.join(SITE, "assets", "video", nome + ".mp4");
const poster = path.join(SITE, "assets", "video", nome + ".jpg");

/* 540 px de largura, ~800 kbps: bom no celular e leve no 4G */
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", origem, "-vf", "scale=540:-2,fps=30", "-c:v", "libx264", "-crf", "31", "-preset", "slow",
  "-maxrate", "900k", "-bufsize", "1800k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k", "-ac", "1", "-movflags", "+faststart", destino], { stdio: "inherit" });
execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", capa, "-i", origem, "-frames:v", "1", "-vf", "scale=540:-2", "-q:v", "4", poster], { stdio: "inherit" });

const mb = statSync(destino).size / 1048576;
console.log(`ok ${nome}.mp4 (${mb.toFixed(1)} MB) e ${nome}.jpg`);
if (mb > 8) console.log("Atenção: passou de 8 MB. Considere cortar o vídeo.");
console.log(`Acrescente em config.js > videos:\n  { arquivo: "${nome}.mp4", poster: "${nome}.jpg", categoria: "A ou B", titulo: "..." }`);
