cp setup/hooks/* .git/hooks

chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/prepare-commit-msg

deno add jsr:@std/assert
deno add jsr:@std/testing
deno add npm:hono

rm -rf main.ts
rm -rf main_test.ts