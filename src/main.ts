import { Actor, CollisionType, Color, Engine, Font, FontUnit, Label, Loader, Sound, vec } from "excalibur"

const game = new Engine({
    width: 800,
    height: 600
})

const barra = new Actor({
    x: 150,
    y: game.drawHeight - 40,
    width: 200,
    height: 20,
    color: Color.Chartreuse,
    name:"BarraJogador"
})

barra.body.collisionType = CollisionType.Fixed
game.add(barra)

game.input.pointers.primary.on("move", (event) => {
    barra.pos.x = event.worldPos.x
})

const bolinha = new Actor({
    x: Math.floor(Math.random() * (700 - 100 + 100)) + 100,
    y: 400,
    radius: 10,
    color: Color.Red
})


bolinha.body.collisionType = CollisionType.Passive

const velocidadeBolinha = vec(400, 400)

setTimeout(() => {
    bolinha.vel = velocidadeBolinha
}, 1000)

bolinha.on("postupdate", () => {
    if (bolinha.pos.x < (bolinha.width / 2)) {
        bolinha.vel.x = velocidadeBolinha.x
    }

    if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
        bolinha.vel.x = -velocidadeBolinha.x
    }

    if (bolinha.pos.y < (bolinha.height / 2)) {
        bolinha.vel.y = velocidadeBolinha.y
    }
})

game.add(bolinha)

const padding = 25

const xoffset = 65
const yoffset = 20

const linhas = 8
const colunas = 5

const corBloco = [Color.Rose, Color.Magenta, Color.Cyan, Color.Blue, Color.Violet, Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const alturaBloco = 20

const listaBlocos: Actor[] = []

for (let j = 0; j < linhas; j++) {
    for (let i = 0; i < colunas; i++) {
        listaBlocos.push(
            new Actor({
                x: xoffset + i * (larguraBloco + padding) + padding,
                y: yoffset + j * (alturaBloco + padding) + padding,
                width: larguraBloco,
                height: alturaBloco,
                color: corBloco[j],
            })
        )
    }
}

listaBlocos.forEach(bloco => {
    bloco.body.collisionType = CollisionType.Active

    game.add(bloco)
})
let pontos = 0

const textoPontos = new Label ({
    text: pontos.toString(),
    font: new Font({
        size: 40,
        color: Color.White,
        strokeColor: Color.Black,
        unit: FontUnit.Px
    }),
    pos: vec(50,300)
})

const soundP = new Sound('./src/sounds/point.wav');
const soundD = new Sound('./src/sounds/roblox-death.mp3')
const loader = new Loader([soundP, soundD]);

game.add(textoPontos)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
    if (listaBlocos.includes(event.other)) {
        event.other.kill()
        pontos++
        soundP.play(0.5);
        textoPontos.text = pontos.toString()
        if (velocidadeBolinha.x < 2100 || velocidadeBolinha.y < 2100) {
            velocidadeBolinha.x += 100
            velocidadeBolinha.y += 100
        }

        if (pontos == linhas * colunas) {
            alert("Você Ganhou!")
            window.location.reload()
        }
        bolinha.color = event.other.color
    }

    let intersection = event.contact.mtv.normalize()

    if (!colidindo) {
        colidindo = true

        if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
            bolinha.vel.x = -bolinha.vel.x
        } else {
            bolinha.vel.y = -bolinha.vel.y
        }
    }
})

bolinha.on("collisionend", () => {
    colidindo = false
})

bolinha.on("exitviewport", async () =>{
    await soundD.play(0)
    alert("Você perdeu!")
    window.location.reload()
})

await game.start(loader) 