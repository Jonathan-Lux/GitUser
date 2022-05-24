export class GitUser {
    static search(username) {
        const api = `https://api.github.com/users/${username}`
        console.log(api)
        return fetch(api)
            .then(data => data.json())
            .then(({login,name,public_repos,followers}) => ({
                login,
                name,
                public_repos,
                followers
            }))
    }
}

export class Favorite {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@DATAGITHUB:")) || []

    }

    saveItems() {
        localStorage.setItem("@DATAGITHUB:", JSON.stringify(this.entries))
    }

    delete(item) {
        const filterDelete = this.entries.filter(it => it.login !== item.login)
        this.entries = filterDelete
        this.update()
        this.saveItems()
    }

    async add(username) {
        try {
            const user = await GitUser.search(username)
            const userExist = this.entries.find(it => it.login === user.login)
            console.log(userExist)
            if(userExist) {
                throw new Error ("Usuário listado")
            }


            if (user.login === undefined) {
                throw new Error("Usuário inválido")
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.saveItems()
        } catch (erro) {
            alert(erro.message)
        }
    }
}


export class FavoriteView extends Favorite {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
        this.onAdd()
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(item => {
            const row = this.createRow()
            row.querySelector(".user img").src = `https://github.com/${item.login}.png`
            row.querySelector(".user img").alt = `Imagem de ${item.name}`
            row.querySelector(".user a").href = `https://github.com/${item.login}`
            row.querySelector(".user p").textContent = item.name
            row.querySelector(".user span").textContent = item.login
            row.querySelector(".repositories").textContent = item.public_repos
            row.querySelector(".followers").textContent = item.followers


            row.querySelector(".remove").onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar?")
                if (isOk) {
                    this.delete(item)
                }
            }

            this.tbody.append(row)
        })
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        })

    }

    createRow() {
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/jonathan-lux.png" alt="eu" />
            <a href="https://github.com/jonathan-lux">
                <p>Jonathan Lux</p>
                <span>jonathan-lux</span>
            </a>
        </td>
        <td class="repositories">44</td>
        <td class="followers">33</td>
        <td>
        <button class="remove">&times;</button>
        </td>`
        return tr
    }

    onAdd() {
        const buttonSearch = this.root.querySelector(".search button")
        buttonSearch.onclick = () => {
            const {
                value
            } = this.root.querySelector(".search input")
            this.add(value)
        }
    }

}