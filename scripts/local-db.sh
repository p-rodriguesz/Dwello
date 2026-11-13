#!/usr/bin/env bash
# Monta o banco local a partir de database/dwello.sql + database/seed.sql,
# criando o usuário do DATABASE_URL do .env. Pede a senha de root do MySQL.
# ATENÇÃO: apaga e recria o banco configurado no .env.
set -euo pipefail
cd "$(dirname "$0")/.."

MYSQL="${MYSQL:-$(command -v mysql || echo /usr/local/mysql/bin/mysql)}"
url=$(grep -E '^DATABASE_URL=' .env | tail -1 | cut -d= -f2- | tr -d "\"'")
[ -n "$url" ] || { echo "DATABASE_URL não encontrada no .env"; exit 1; }

rest=${url#mysql://}
creds=${rest%%@*}; hostpart=${rest#*@}
user=${creds%%:*}; pass=${creds#*:}
db=${hostpart#*/}; db=${db%%\?*}
hostport=${hostpart%%/*}; port=${hostport##*:}; [ "$port" = "$hostport" ] && port=3306

echo "Criando usuário '$user' e banco '$db' (porta $port) a partir dos .sql..."
sed -e "s/CREATE DATABASE IF NOT EXISTS dwello /CREATE DATABASE IF NOT EXISTS \`$db\` /" \
    -e "s/^USE dwello;/USE \`$db\`;/" database/dwello.sql > /tmp/dwello-local-schema.sql
sed -e "s/^USE dwello;/USE \`$db\`;/" database/seed.sql > /tmp/dwello-local-seed.sql

ADMIN_USER="${MYSQL_ADMIN_USER:-root}"
echo "Digite a senha do usuário administrador '$ADMIN_USER' do MySQL (não é a senha do .env):"
"$MYSQL" -u "$ADMIN_USER" -p <<SQL
DROP USER IF EXISTS ''@'localhost';
CREATE USER IF NOT EXISTS '$user'@'localhost' IDENTIFIED BY '$pass';
CREATE USER IF NOT EXISTS '$user'@'127.0.0.1' IDENTIFIED BY '$pass';
ALTER USER '$user'@'localhost' IDENTIFIED BY '$pass';
ALTER USER '$user'@'127.0.0.1' IDENTIFIED BY '$pass';
GRANT ALL PRIVILEGES ON \`$db\`.* TO '$user'@'localhost';
GRANT ALL PRIVILEGES ON \`$db\`.* TO '$user'@'127.0.0.1';
FLUSH PRIVILEGES;
DROP DATABASE IF EXISTS \`$db\`;
SOURCE /tmp/dwello-local-schema.sql;
SOURCE /tmp/dwello-local-seed.sql;
SQL

rm -f /tmp/dwello-local-schema.sql /tmp/dwello-local-seed.sql
echo "Pronto: banco '$db' criado a partir dos .sql e usuário '$user' liberado."
