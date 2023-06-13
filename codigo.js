const gramatica = {
    S:['A','ABa','AbA'],
    A:['Aa','ε'],
    B:['Bb','BC'],
    C:['CB','CA','bB']
}

calculo()
mostraNaTela()
console.log(gramatica);

function calculo() {  
    // Removendo vazio  
    let prodS = [].concat(gramatica['S'])
    prodS.shift()     
    prodS = prodS.map(producao => producao.replace('A',''))
    prodS = prodS.map(producao => producao.replace('A',''))       
    prodS.push('Ab','bA')
    gramatica.S = gramatica.S.concat(prodS)    
    gramatica['A'].pop()

    let prodA = [].concat(gramatica['A'])    
    prodA = prodA.map(producao => producao.replace('A',''))       
    gramatica.A = gramatica.A.concat(prodA) 

    let prodC = [].concat(gramatica['C'])    
    prodC = prodC[1].replace('A','')    
    gramatica.C = gramatica.C.concat(prodC)

    //Removendo unitarios
    prodS = [].concat(gramatica['A'])
    gramatica.S.shift()   
    prodS = prodS.concat(gramatica.S)
    gramatica.S = prodS
    gramatica.C.pop()

    //Colocando novos nomes as variaveis
    Object.assign(gramatica, {
        A1:gramatica.S,
        A2:gramatica.A,
        A3:gramatica.B,
        A4:gramatica.C,
    })  
    delete gramatica.S; delete gramatica.A; delete gramatica.B; delete gramatica.C

    let aux = []
    Object.getOwnPropertyNames(gramatica).forEach(producao => {

        aux = Object.getOwnPropertyDescriptor(gramatica,producao).value.map(
            termo => {
                termo = termo.replace('S','A1')
                termo = termo.replace('A','A2')
                termo = termo.replace('B','A3')           
                termo = termo.replace('C','A4')
                return termo                     
        })        
        Object.defineProperty(gramatica,producao,{value:aux})
    })   

    //Eliminando recursões    
    let resto = gramatica.A2.shift()
    resto = resto.replace('A2','')
    Object.assign(gramatica,{ 
        "A2'":[resto, resto+"A2'"]
    })
    gramatica.A2.push(gramatica.A2[0]+"A2'")     

     
    resto = gramatica.A3.shift() 
    resto = resto.replace('A3','')
    Object.assign(gramatica,{
        "A3'":[resto, resto+"A3'"]
    })
    
    resto = gramatica.A3.shift() 
    resto = resto.replace('A3','')
    Object.assign(gramatica,{
        "A3''":[resto, resto+"A3''"]
    })    
    gramatica.A3 = gramatica["A3''"]
    
    resto = gramatica.A4.shift() 
    resto = resto.replace('A4','')
    Object.assign(gramatica,{
        "A4'":[resto, resto+"A4'"]
    }) 

    gramatica["A4'"].shift()
    gramatica.A3.reverse().forEach(produiz => gramatica["A4'"].unshift(produiz))    

    resto = gramatica["A4'"].pop()
    resto = resto.replace('A3','')
    gramatica.A3.reverse().forEach(produiz => gramatica["A4'"].push(produiz+resto))  


    resto = gramatica.A4.shift()
    resto = resto.replace('A4','')
    Object.assign(gramatica,{ 
        "A4''":[resto, resto+"A4''"]
    })  
    gramatica.A4.push(gramatica.A4[0]+"A4''")
    
    gramatica["A4''"].shift()
    gramatica.A2.reverse().forEach(produiz => gramatica["A4''"].unshift(produiz))    
    
    resto = gramatica["A4''"].pop() 
    resto = resto.replace('A2','')
    gramatica.A2.reverse().forEach(produiz => gramatica["A4''"].push(produiz+resto))

    let problemas = ['A3','A1',"A3''","A4'"]

    //Inserir terminais na frente
    problemas.forEach(producaoProblematica => {
        for (let posicao = 0; posicao < gramatica[producaoProblematica].length; posicao++) {
            const elemento = gramatica[producaoProblematica][posicao];
            let inicio,fim,producaoSubstituta
            
            if (elemento.charAt(0) === "A") { 
                inicio = gramatica[producaoProblematica].slice(0,posicao)                
                fim = gramatica[producaoProblematica].slice(posicao + 1)                
                producaoSubstituta = elemento.substring(0,2) 
                let inalterado = elemento.replace(producaoSubstituta,'')                    
                
                gramatica[producaoSubstituta].forEach(produiz => {
                        if (produiz === inalterado) inicio.push(produiz)
                        else inicio.push(produiz + inalterado)
                    }
                )
                gramatica[producaoProblematica] = inicio = inicio.concat(fim)
                gramatica[producaoProblematica] = gramatica[producaoProblematica].filter((elemento, posicao) => {
                    return gramatica[producaoProblematica].indexOf(elemento) === posicao;
                }); 
            }                  
        }
    })
    
    aux = []
    Object.assign(gramatica,{
        A5:['a'],
        A6:['b']
    })
        
    Object.getOwnPropertyNames(gramatica).forEach(producao => {
        aux = Object.getOwnPropertyDescriptor(gramatica,producao).value.map(termo => {
            if (termo.length > 1) {
                let guardaLetra = termo.charAt(0)
                termo = termo.substring(1,termo.length)
                termo = termo.replace('a','A5')
                termo = termo.replace('b','A6')
                termo = guardaLetra + termo                           
            }            
            return termo            
        })
        Object.defineProperty(gramatica,producao,{value:aux})
    })
}

function mostraNaTela() {
    var resultado = ''
    Object.getOwnPropertyNames(gramatica).forEach(producao => {
        resultado += producao +' → '+ Object.getOwnPropertyDescriptor(gramatica,producao).value.toString().replaceAll(',',' | ') + "\n"        
    })
    
    document.getElementById('resultado').innerText = resultado
}
