'use strict'; 

$(document).ready(init); 

var contacts = []; 
var editingContact = false; 
var editObj; 

function init() {
  console.log("init");

  loadFromStorage(); 
  updateList();

  $('#add').click(add);
  $('#body').on('dblclick', '.remove', remove);
  $('#body').on('click', '.edit', edit);
  $('#body').on('click', '#editConfirm', confirm);
  $('#sortAlpha').click(sortAlpha);
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
    $newRow.append($('<div>').addClass('col-md-1 col-md-offset-2 remove').text('\u27F0')); 
    $newRow.append($('<div>').addClass('col-md-1 edit').text('\u270E')); 
    $contacts.append($newRow); 
  });
  $contactList.append($contacts); 
}


function remove(){
  console.log("remove!");
  var index = $(this).parent().index(); 
  contacts.splice(index, 1); 
  updateList(); 
  saveToStorage(); 
}

function edit(){
  console.log("edit!");
  var $this = $(this);
  var $parent = $this.parent(); 
  var index = $parent.index(); 
  if ($parent.hasClass("isEditing")) {
    // editObj = {}
    // $parent.children(".type").removeAttr("id");
    // $parent.children(".amount").removeAttr("id");
    // $parent.removeClass("isEditing");
    // $('.editing').remove(); 
    // editingContact = false; 
    closeEditForm(); 
  } else if(!editingContact) {
    editingContact = true; 
    editObj = {}; 
    // $parent.addClass("isEditing");
    $parent.attr("id", "previous"); 
    $parent.children(".name").attr("id", "previousName");
    // $parent.children(".type").attr("id", "previousType");
    // $parent.children(".amount").attr("id", "previousAmount");
    // $parent.children(".date").attr("id", "previousDate");
    editObj.name = $("#previousName").text(); 
    // editType = $parent.children(".type").text(); 
    // editAmount = $parent.children(".amount").text().substr(1); 
    // editDate = $parent.children(".date").text(); 


    var $editForm = $('<div>').addClass('row').attr("id", "editForm");
    $editForm.append($('<span>').addClass('col-sm-1').text('Name:'));
    $editForm.append($('<input>').addClass('col-sm-9').attr({type: "text", id: "editName", placeholder: editObj.name} ) );
    
    // $editForm.append($('<span>').addClass('col-sm-1').text('Type:'));
    // $editForm.append($('<div>').addClass('col-sm-1 btn btn-default').text('Credit').attr("id", "editCredit"));
    // $editForm.append($('<div>').addClass('col-sm-1 btn btn-default').text('Debit').attr("id", "editDebit"));
    // $editForm.append($('<span>').addClass('col-sm-1 col-sm-offset-1').text('Amount:'));
    // $editForm.append($('<input>').addClass('col-sm-2').attr({type: "number", step: "0.01", value: "0.00", min: "0.00", id: "editAmount"} ) );
    // $editForm.append($('<span>').addClass('col-sm-1 col-sm-offset-1').text('Date:'));
    // $editForm.append($('<input>').addClass('col-sm-3').attr({type: "date", id: "editDate"} ) );
    $editForm.append($('<div>').addClass('col-sm-2 btn btn-default').text('Confirm').attr("id", "editConfirm"));
    $parent.after($editForm);    
  }


};

function confirm(){
  editObj.name = $('#editName').val(); 
  var index = $('#previous').index(); 
  contacts[index].name = editObj.name; 
  closeEditForm(); 
  updateList(); 
  saveToStorage(); 
};

function closeEditForm(){
  editObj = {};
  var $previous = $("#previous"); 
  $previous.children(".type").removeAttr("id");
  $previous.children(".amount").removeAttr("id");
  $previous.removeClass("isEditing");
  $previous.removeAttr("id");
  $("#editForm").remove();  
  editingContact = false;  
};

function sortAlpha(){
  contacts.sort(function(a, b){
    if (a.name > b.name) {
      return 1; 
    };
    if (a.name < b.name) {
      return -1; 
    };
    return 0; 
  });
  updateList(); 
  saveToStorage(); 
}