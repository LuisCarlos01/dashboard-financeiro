/**
 * Script para gerar hash SHA-256 de senha para autenticação
 * 
 * Uso:
 * 1. Rode: npx tsx scripts/generate-password-hash.ts
 * 2. Digite sua senha quando solicitado
 * 3. Copie o hash gerado para VITE_AUTH_PASSWORD_HASH no .env.local
 * 
 * Alternativa (passar senha como argumento):
 * npx tsx scripts/generate-password-hash.ts "sua_senha_aqui"
 */

import * as readline from 'readline';
import { createHash } from 'crypto';

function generateHash(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function promptPassword(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Digite sua senha: ', (password) => {
      rl.close();
      resolve(password);
    });
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('🔐 Gerador de Hash SHA-256 para Autenticação');
  console.log('='.repeat(60));
  console.log();

  // Senha pode vir como argumento ou via prompt
  const password = process.argv[2] || await promptPassword();

  if (!password || password.trim().length === 0) {
    console.error('❌ Senha não pode ser vazia!');
    process.exit(1);
  }

  if (password.length < 6) {
    console.warn('⚠️  AVISO: Senha muito curta (recomendado: mínimo 6 caracteres)');
  }

  const hash = generateHash(password);

  console.log();
  console.log('✅ Hash gerado com sucesso!');
  console.log();
  console.log('-'.repeat(60));
  console.log('Senha:', '*'.repeat(password.length));
  console.log('Hash: ', hash);
  console.log('-'.repeat(60));
  console.log();
  console.log('📋 Próximos passos:');
  console.log('1. Copie o hash acima');
  console.log('2. Cole no arquivo .env.local na variável:');
  console.log('   VITE_AUTH_PASSWORD_HASH=' + hash);
  console.log();
  console.log('3. Configure seu email:');
  console.log('   VITE_AUTH_EMAIL=seu@email.com');
  console.log();
  console.log('4. (Opcional) Configure seu nome:');
  console.log('   VITE_AUTH_USER_NAME=Seu Nome');
  console.log();
  console.log('='.repeat(60));
}

main().catch(console.error);

