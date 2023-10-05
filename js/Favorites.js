import {GithubUser} from './GithubUser.js'



class Favorites{
    constructor(root){ //app
        this.root = document.querySelector(root)
        this.load()
        this.onadd()
        GithubUser.search('sdc-jeferson').then(user => console.log(user)) // continuação da promessa
    }
    

    load(){ //carregamento dos dados
        this.entries = JSON.parse(localStorage.getItem('@github-favorites2:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites2:', JSON.stringify(this.entries))
    }

    async add(username){

        try{

            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist){
               throw new Error('Usuário ja cadastrado')
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw new Error("Usuário não encontrado!")
            }


            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }catch(error){
            alert(error.message)
        }
    }


    delete(user){
        const filtredEntries = this.entries
        .filter(entry => entry.login !== user.login)
                
        this.entries = filtredEntries
        this.update()
        this.save()
    }
   
}


export class FavoritesView extends Favorites{
    constructor(root){
        super(root) // Chamado o root de Favorites
       this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    createRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td class="user">
        <img src="https://github.com/sdc-jeferson.png" alt="imagem de jeferson silva">
        <a href="https://github.com/sdc-jeferson" target="_blank">
            <p>Jeferson Silva</p>
            <span>/sdc-jeferson</span>
        </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td>
          <button class="remove">Remover</button>
         </td>
        
        `

         return tr; 
    }

    

    onadd(){
       const addButton = this.root.querySelector('.search-button')

       addButton.onclick = () => {
        const {value} = this.root.querySelector('.search input')   

        this.add(value)
       }       
    }


    update(){
        this.removeAllTr()

        this.entries.forEach(user =>{
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de /${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {

                const isOk = confirm('Tem certeza que deseja deletar esse usuário ?') //boolean

                if(isOk){
                    this.delete(user)
                }
            }

            
            this.tbody.append(row)
        })
        
    }


    removeAllTr(){  

        this.tbody.querySelectorAll('tr').forEach((tr) =>{ 
            tr.remove() // acessei o tbody e para cada TR e removi
        })
    }
}
