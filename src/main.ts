import { Actor, CollisionType, Color, Engine, Font, Text, vec } from "excalibur"

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
    y: 300,
    radius: 10,
    color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

const velocidadeBolinha = vec(200, 200)

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

const padding = 20

const xoffset = 65
const yoffset = 20

const linhas = 3
const colunas = 5

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const alturaBloco = 30

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

const textoPontos = new Text({
    text: "Points: " + pontos,
    font: new Font ({size: 20})

})

const objetoTexto = new Actor({
    x: game.drawWidth - 80,
    y: game.drawHeight - 15,
    color: Color.White,

})

objetoTexto.graphics.use(textoPontos)

game.add(objetoTexto)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
    if (listaBlocos.includes(event.other)) {
        event.other.kill()
        pontos++
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

// bolinha.on("exitviewport", () =>{
//     alert("Você perdeu!")
//     window.location.reload()
// })

game.start()