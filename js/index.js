const HOST = 'localhost';
const PORT = 3000;
const baseUrl = `http://${HOST}:${PORT}`;

let employees = [];
let lastMessageId = 0;


let employeeTemplate = document.getElementById('employeeTemplate');
let newEmployeeForm = document.getElementById('newEmployee');
let editEmployeeForm = document.getElementById('editEmployee');
let employeesList = document.getElementById('employeesList');
let messages = document.getElementById('messages');

function createMessage(id, message, type = 'info'){
    return `
        <div id ="msg${id}" class="alert alert-${type} col-3 float-right">
           ${message}
        </div>    
    `

}
function removeMessage(id){
    document.getElementById(`msg${id}`).outerHTML = '';
}

function addMessage(message, type = 'info'){
    messages.innerHTML += createMessage(++lastMessageId, message, type );
    setTimeout(() => {
        removeMessage(lastMessageId)
    }, 3000);
}

function getEmployees(){
    fetch(`${baseUrl}/employees`)
    .then(response =>{
        if(response.status === 404 ){
            throw new Error('404 - Cущность не найдена в системе.');
         }
         if(response.status === 400 ){
            throw new Error('400 - Неверный запрос.');
         }
         if(response.status === 500 ){
            throw new Error('500 – Cерверная ошибка (например, при обработки данных).');
         }

         return  response.json();
    })
    .then(data => {
        employees = data;

        for(let employee of employees ){
            employeesList.appendChild(
                cteateEmployeeElement(employee.id , employee.firstName , employee.lastName )
            );
        }
        
        addMessage(" 200 – Успешное выполнение запроса" , 'success')
        lastemployeesId = employees[employees.length - 1].id;
    })
   
    .catch(error => {
        addMessage(error.message , 'danger')
    })    
}

function addEmployee(firstName, lastName){   
    let employee = {         
        firstName,
        lastName,
    };  

    fetch(`${baseUrl}/employees`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    }).then(response => response.json())
    .then(employee => {  
        employees.push(employee) ;      
        employeesList.appendChild(
            cteateEmployeeElement(employee.id, employee.firstName , employee.lastName )
        );

        
    })
    ;      
}


function updateEmployee(id, firstName , lastName){
    fetch(`${baseUrl}/employees/${id}` ,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
        }),
    }).then(response => response.json())
    .then(emple => {  
        for(let employee of employees ){
            if(emple.id === employee.id){
                employee.firstName = emple.firstName;
                employee.lastName = emple.lastName;
            
            }
        }      
        document.getElementById(`employee${emple.id}firstName`).innerHTML = emple.firstName;
        document.getElementById(`employee${emple.id}lastName`).innerHTML = emple.lastName;       
       
    })
    ;     
}


function deleteEmployee(id){    
    fetch(`${baseUrl}/employees/${id}`,{
        method: 'DELETE',
       
        }).then(response => {
            if(response.status === 200){
                for(let index in employees ){
                    if(employees[index].id === id){
                        delete employees[index];
                    
                    }
                }
                if(confirm('Вы хотите удалить это сотруднка ?')) {      
                    document.getElementById("employee"+id).outerHTML = " ";                    
                }
            }
        }
     ) ;      
}


function fillEditForm(id){
    for(let employee of employees ){
        if(employee.id === id){
            document.getElementById('editId').value = id;
            document.getElementById('editFirstName').value = employee.firstName;
            document.getElementById('editLastName').value = employee.lastName;
            break;

        }
    }
    
}

function cteateEmployeeElement(id, firstName , lastName ){
    let employeeElement = employeeTemplate.content.cloneNode(true);
    employeeElement.querySelector('tr').id = `employee${id}`;
    employeeElement.getElementById('employeeFirstName').innerText = firstName;
    employeeElement.getElementById('employeeFirstName').id = `employee${id}firstName`;
    employeeElement.getElementById('employeelastName').innerText = lastName;
    employeeElement.getElementById('employeelastName').id = `employee${id}lastName`;
    employeeElement.querySelector('.edit').onclick = () => fillEditForm(id);
    employeeElement.querySelector('.delete').onclick = () => deleteEmployee(id);

    return employeeElement;
}

newEmployeeForm.onsubmit = function(e){
    let nameElement=document.getElementById('newfirstName');
    let lastElement=document.getElementById('newlastName');  
    let firstName = nameElement.value;
    let lastName = lastElement.value;
    addEmployee(firstName, lastName)
    
    this.reset();
     e.preventDefault();
}


   // Редактирование сотрудника
editEmployeeForm.onsubmit = function(e){
    let idElement=document.getElementById('editId');
    let nameElement=document.getElementById('editFirstName');
    let lastElement=document.getElementById('editLastName');
    let id = idElement.value;
    let firstName = nameElement.value;
    let lastName = lastElement.value;
    
    updateEmployee(id, firstName , lastName)
    this.reset();
    e.preventDefault();
}    
  
   
getEmployees();    

   
   




    
    



    