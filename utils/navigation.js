const i_class = ["fa-solid fa-house","fa-solid fa-pen","fa-solid fa-clock-rotate-left" , "fa-solid fa-user" , "fa-solid fa-gear"];
const routes =  ["./index.html", "./create.html", "./history.html", "./profile.html", "./settings.html"];
const main_nav = document.getElementById("nav");
main_nav.style.height ="100dvh"
main_nav.style.width ="5%"
main_nav.style.position = "fixed"
function changePage(Routepage)
{
   let a = document.createElement("a");
   a.href = Routepage;
   a.click();
   a.remove();

}
function nav()
{
    // document.body.style.backgroundColor = "black"
    let ul = document.createElement("ul");
    for (let j=0; j<i_class.length; j++)
    {
        let li = document.createElement("li");
        li.id = `li${j}`;

        let i = document.createElement("i");
        i.className = i_class[j];
        i.style.fontSize = "24px"
        i.addEventListener("click", function() {
            changePage(routes[j]);
        });
        
        
        li.appendChild(i);
        ul.appendChild(li);
       
        ul.style.height = "90dvh"
    }
    ul.style.display = "flex";
    ul.style.listStyle = "none"
    ul.style.padding = "35%"
    ul.style.flexDirection = "column";
    ul.style.justifyContent = "space-around"
    main_nav.appendChild(ul);
    

}

nav();