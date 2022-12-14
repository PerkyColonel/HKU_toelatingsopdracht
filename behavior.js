
class MeleeWeapon extends Entity{
    constructor({ game, html, data, owner }) {
        super({ game, html, data });
        this.owner = owner;
        this.position = owner.position;
        this.effect = false;
        this.attackPoint = owner.position;
        this.swingStage = [];
        this.view = this.rotation < 90 && this.rotation > -90 ? "right" : "left";
        this.cooldown = data?.stat?.cooldown;

        this.aimAtPlayer();
        this.loadEvents();
        this.renderElement();
    }

    add(accumulator, a){
        return accumulator + a;
    }

    smooth(current, target){
       let factor;
       current == 0 ? current = target : current;
        factor = Math.round((target / current) * 100) / 100;
        console.log(factor);
        return factor;
    }
    
    swing(){
        this.swingStage.length == 0 ? this.swingStage.push(this.rotation) : this.swingStage[0] = this.rotation ;
        
        if (this.swingStage.length >= 30) {
            this.swingStage = [];
            return "Klaar";
        }
        
        let newRotation;
        let lastArrayItem = this.swingStage.pop();
        const x = this.owner.character.position.x * 4 / Game.PIXEL_SIZE - 7 - this.position.x;
        const y = this.owner.character.position.y * 4 / Game.PIXEL_SIZE - 7 - this.position.y;

        this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        const swingMult = x < 0 ? -1 : 1;

        if (this.swingStage.length < 25) {
            newRotation = lastArrayItem -2 * swingMult;
        }
        else { newRotation = lastArrayItem + 15 * swingMult;}

        if (newRotation > 180  || newRotation < -180){
            newRotation*= -1;
        }


        this.rotation = newRotation;
        this.swingStage.push(lastArrayItem, newRotation);

    }

    aimAtPlayer(){
        const x = this.owner.character.position.x * 4 / Game.PIXEL_SIZE - 7 - this.position.x;
        const y = this.owner.character.position.y * 4 / Game.PIXEL_SIZE - 7 - this.position.y;
        this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;


        const inbetween = this.smooth(this.rotation, Math.atan2(y, x) * (180 / Math.PI));
        // this.rotation = Math.atan2(y, x) * (180 / Math.PI) * inbetween;
        this.rotation *= inbetween;
        // this.rotation*= inbetween;
    }

    onUpdate() {
        this.cooldown > 0 ? (this.cooldown--, this.aimAtPlayer()) : this.swing() == "Klaar" ? this.cooldown = 120: null;
}       

    onAnimation() {
        this.updatePosition();
    }
}


class Melee extends Entity {
    constructor({ game, html, data, character }) {
        super({ game, html, data });
        this.isMoving = false;
        this.stats = data?.stats;
        this.delay = data?.moveDelay;
        this.character = character;
        this.duration = 0;
        this.active = false;
        this.view = "left";
        this.type = Game.random(1, 2);


        this.weapon = new MeleeWeapon({
            game,
            owner: this,
            data: {
                cooldown: 120,
            },
            html: {
                classList: ["character-pointer"],
            },
        });

        this.loadEvents();
        this.renderElement();
    }



    data() {
        const x = (this.center.x - this.position.x) / 100;
        const y = (this.center.y - this.position.y) / 100;
        const d = Math.round(Math.sqrt(x * x + y * y) * 100) / 100;
        const speed = Math.round((2 / d) * 100 ) / 100;

        this.view = x > 0 ? "right" : "left";

        return { x, y, speed };
    }

    onUpdate() {

        this.center = {
            x: this.character.position.x + this.character.size.x / 2,
            y: this.character.position.y + this.character.size.y / 2,
        };



        if (this.stats.hp <= 0) {
            this.shadow.delete();
            this.delete();
        }

        this.setView(this.view);
        this.setSprite(`./images/frog-${this.view}${this.active ? "-jump" : ""}-2.png`);

        const direction = { x: this.data().x, y: this.data().y };
        const filter = ["Character", "Cursor"];

        [...this.game.objects]
            .filter((o) => o !== this && o.hasCollision)
            .filter((o) => filter.includes(o.constructor.name) === false)
            .forEach((o) => this.addCollider(o));

        // if (this.duration === 0) {
        //     this.active = true;
        //     this.velocity.x = this.stats.speed * this.data().speed * direction.x;
        //     this.velocity.y = this.stats.speed * this.data().speed * direction.y;
        //     this.duration = this.delay;
        // }

        // if (this.duration < this.delay / 2) {
        //     this.active = false;
        //     this.velocity.x = 0;
        //     this.velocity.y = 0;
        //     this.duration--;
        // } else {
        //     this.duration--;
        // }

        this.move();
        this.renderVelocity();
    }

    onAnimation() {
        this.updatePosition();
    }
}