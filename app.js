'use strict'; 

$(document).ready(init); 

var contacts = []; 
var editingContact = false; 
var isAlpha = false; 
var editObj; 

function init() {
  loadFromStorage(); 
  updateList();

  $('#add').click(add);
  // $('#body').on('dblclick', '.remove', remove);
  $('#body').on('click', '.remove', remove);
  $('#body').on('click', '.edit', edit);
  $('#body').on('click', '#editConfirm', confirm);
  $('#sortAlpha').click(sortAlpha);
  $('#showAll').click(showAll);
  $('#showFriends').click(showFriends);
  $('#showFamily').click(showFamily);
  $('#showCustom').click(showCustom);
}


function add() {
  var contact = {};
  contact.name = $('#newName').val();
  contact.phone = $('#newPhone').val();
  contact.email = $('#newEmail').val();
  contact.group = _.uniq($('#newGroup').val().toLowerCase().split(/\W/)) ;
  contact.birthday = $('#newBirthday').val();
  
  contacts.push(contact);
  
  saveToStorage(); 
  updateList(); 
}

function saveToStorage(){
  localStorage.contacts = JSON.stringify(contacts); 
}

function loadFromStorage(){
  if (!localStorage.contacts) {
    localStorage.contacts = '[]'; 
  };
  contacts = JSON.parse(localStorage.contacts);  
}

function updateList(){
  var $contactList = $('#body');
  $contactList.empty(); 
  var $contacts = $('<div>').addClass('container').attr('id', "body");
  contacts.forEach(function(contact){
    var $newRow = $('<div>').addClass('row item'); 
    $newRow.append($('<div>').addClass('col-sm-3 name').text(contact.name) );
    $newRow.append($('<div>').addClass('col-sm-1 phone').text(contact.phone) );
    $newRow.append($('<div>').addClass('col-sm-2 email').text(contact.email) );
    $newRow.append($('<div>').addClass('col-sm-2 group').text(contact.group) );
    $newRow.append($('<div>').addClass('col-sm-2 birthday').text(contact.birthday) );
    var $icons = $('<div>').addClass('col-sm-2 row'); 
    $icons.append($('<span>').addClass('remove col-sm-4').text('\u27F0')); 
    $icons.append($('<input />', { type: 'checkbox'}).addClass('check col-sm-4')); 
    $icons.append($('<span>').addClass('edit col-sm-4').text('\u270E')); 
    $newRow.append($icons);
    // $newRow.append($('<div>').addClass('col-sm-1 remove').text('\u27F0')); 
    // $newRow.append($('<input />', { type: 'checkbox'}).addClass('col-sm-1 check')); 
    // $newRow.append($('<div>').addClass('col-sm-1 edit').text('\u270E')); 
    $contacts.append($newRow); 
  });
  $contactList.append($contacts); 
}


function remove(){
  var index = $(this).closest('.item').index(); 
  contacts.splice(index, 1); 
  updateList(); 
  saveToStorage(); 
}

function edit(){
  var $this = $(this);
  var $parent = $this.closest('.item'); 
  var index = $parent.index(); 
  if ($parent.hasClass("isEditing")) {
    closeEditForm(); 
  } else if(!editingContact) {
    editingContact = true; 
    editObj = {}; 
    $parent.addClass("isEditing");
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
  if (!isAlpha) {
    isAlpha = true; 
    contacts.sort(function(a, b){
    if (a.name > b.name) {
      return 1; 
    };
    if (a.name < b.name) {
      return -1; 
    };
      return 0; 
    });  
  } else {
    isAlpha = false; 
    contacts.sort(function(a, b){
    if (a.name > b.name) {
      return -1; 
    };
    if (a.name < b.name) {
      return 1; 
    };
      return 0; 
    });

  }
  
  updateList(); 
  saveToStorage(); 
}; 

function showAll(){
  $('.item').removeClass('hide');
};

function showFriends(){
  var $item = $('.item');
  $item.addClass('hide'); 
  $item.each(function(index){
    if ( _.includes($item.eq(index).children(".group").text().split(/\W/), 'friends') ) {
      $item.eq(index).removeClass('hide');
    } 
  }); 
};

function showFamily(){
  var $item = $('.item');
  $item.addClass('hide'); 
  $item.each(function(index){
    if ( _.includes($item.eq(index).children(".group").text().split(/\W/), 'family') ) {
      $item.eq(index).removeClass('hide');
    } 
  }); 
};

function showCustom(){
  var $customFilter = $('#customFilter');
  var array = $customFilter.val().toLowerCase().split(/\W/);
  var $item = $('.item');
  $item.addClass('hide'); 
  $item.each(function(index){
    array.forEach(function(entry){
      if ( _.includes($item.eq(index).children(".group").text().split(/\W/), entry) ) {
        $item.eq(index).removeClass('hide');
      } 
    });
  }); 
};
