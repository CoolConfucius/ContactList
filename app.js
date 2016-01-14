'use strict'; 

$(document).ready(init); 

var contacts = []; 

function init() {
  console.log("init");

  loadFromStorage(); 
  updateList();

  $('#add').click(add);
  $('#body').on('dblclick', '.delete', remove);
}


function add() {
  console.log("addContact");
  var contact = {};
  contact.name = $('#newName').val();   
  
  contacts.push(contact);
  
  saveToStorage(); 
  updateList(); 
}

function saveToStorage(){
  console.log("saveToStorage");
  localStorage.contacts = JSON.stringify(contacts); 
}

function loadFromStorage(){
  console.log("loadFromStorage");
  if (!localStorage.contacts) {
    localStorage.contacts = '[]'; 
  };
  contacts = JSON.parse(localStorage.contacts);  
}

function updateList(){
  console.log("updateList");
  var $contactList = $('#body');
  $contactList.empty(); 
  console.log("show this");
  var $contacts = $('<div>').addClass('container').attr('id', "body");
  contacts.forEach(function(contact){
    console.log("here?");
    var $newRow = $('<div>').addClass('row item'); 
    $newRow.append($('<div>').addClass('col-md-5 name').text(contact.name) );
    $newRow.append($('<div>').addClass('col-md-1 delete').text('\u27F0')); 
    $contacts.append($newRow); 
  });
  $contactList.append($contacts); 
}


function remove(){
  console.log("DOUBLECLICK");
  var index = $(this).parent().index(); 
  contacts.splice(index, 1); 
  updateList(); 
  saveToStorage(); 
}