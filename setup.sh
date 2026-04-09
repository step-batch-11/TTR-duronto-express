cp setup/hooks/* .git/hooks

chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

deno add jsr:@std/assert
deno add jsr:@std/testing
deno add npm:hono
deno add -D npm:playwright

rm -rf main.ts
rm -rf main_test.ts