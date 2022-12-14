
const game = new Game();

const room = new Room({
    game,
    layout: [
        [21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [24, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 25],
        [26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28],
    ],
});

const cursor = new Cursor({
    game,
    html: {
        parent: "canvas",
        id: "cursor",
    },
    data: { sprite: "./images/cursor-default.png" },
});

const character = new Character({
    game,
    cursor,
    data: {
        size: { x: 16, y: 16 },
        position: {
            x: 16 * Game.random(3, 10) + Game.ROOM_OFFSET.x * 16,
            y: 16 * Game.random(3, 10) + Game.ROOM_OFFSET.y * 16,
        },
        stats: {
            maxHp: 50,
            hp: 50,
            maxMana: 100,
            mana: 1000000000,
            speed: 0.15,
            fireRate: 300,
            baseDamage: 10,
        },
        keybinds: {
            up: "w",
            down: "s",
            left: "a",
            right: "d",
            cast: " ",
        },
    },
    html: {
        id: "character",
        classList: ["character-default"],
    },
});

new Melee({
    game,
    character,
    data: {
        hasCollision: true,
        isDefaultDestructable: true,
        moveDelay: 1,
        size: { x: 16, y: 16 },
        position: {
            x: 16 * Game.random(2, 9) + Game.ROOM_OFFSET.x * 16,
            y: 16 * Game.random(2, 9) + Game.ROOM_OFFSET.y * 16,
        },
        stats: {
            maxHp: 50,
            hp: 50,
            speed: 1,
            attackSpeed: 1,
            baseDamage: 5,
        },
    },
    html: { classList: ["frog"] },
});
