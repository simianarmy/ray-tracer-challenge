export const Projectile = (pos, vel) => {
  const toString = () =>
    `position: ${pos.toString()}, velocity: ${vel.toString()}\n`;

  return {
    toString,
    position: pos,
    velocity: vel
  };
};
