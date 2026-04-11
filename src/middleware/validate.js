export const validate = (schema) => async (c, next) => {
  try {
    const body = await c.req.json();
    const parsed = schema.parse(body);

    c.set("validatedBody", parsed);
    await next();
  } catch (err) {
    return c.json(
      {
        error: err.errors?.[0]?.message || "Invalid request",
      },
      400,
    );
  }
};
