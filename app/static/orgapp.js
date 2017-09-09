
    // --------------------------- Script for to-do list functionality --------------------------------

    // Create a "close" button and append it to each list item
    var myNodelist = document.getElementsByClassName("li");
    var i;
    for (i = 0; i < myNodelist.length; i++) {
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      myNodelist[i].appendChild(span);
    }

    // Click on a close button to hide the current list item
    var close = document.getElementsByClassName("close");
    var i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var div = this.parentElement;
        div.style.display = "none";
        //PUT THIS IN A GARBAGE BIN SO IT CAN STILL BE RETRIEVED
      }
    }

    $('.new-list .btn').click(function() {
      newListName = $("#newlist-input").val();
      createList(newListName);
      document.getElementById('newlist-input').value = "";
    });


    // add checked behavior to list items that already exist (from Python code)
    var alllistitems = document.getElementsByClassName("select-li");
    var checkedArray = [];

    for (i = 0; i < alllistitems.length; i++) {

        id = alllistitems[i].getAttribute("id");
        value = $('#' + id + ' .li-contents').html();                                                           //TESTING
        applyCheckedBehavior(id, value, 'select-li');
        if ($('#' + id).hasClass('checked-selected')) {
            checkedArray.push(alllistitems[i]);
            //newElement('todayUL','do-li','todayInput',value);
        }
        //toggleParallelItem(id,value);
    }

    //console.log(checkedArray);

    checkedArray.forEach(function(item, index) {
        $item = $('#' + item.getAttribute("id") + ' .li-contents');
        $ulID = $item.parent().parent().prop("id");
        //console.log($ulID);
        newElement('todayUL', 'do-li', 'todayInput', $item.html(), $ulID);
    });
    //for (i = 0; i < checkedArray.length; i++) {
//
     //   newElement('todayUL', 'do-li', 'todayInput', $(checkedArray[i]).html());
    //}
    getTodayCount();


    // Create a new list item when clicking on the "Add" button
    function newElement(ulID,liType,inputID, liValue = 0, sourceList = 'today') {
      var li = document.createElement("li");
      li.className = "li " + liType;
      
      // If a value is passed in via a parameter. If not, it means it was entered in a text field
      if (liValue == 0) {
        var inputValue = document.getElementById(inputID).value;
      } else {
        var inputValue = liValue;
      }

      // get UL value and element
      
      if (liType == "do-li") {
        var liID = 'today-' + inputValue.replace(/\W/g,'_') + '-' + sourceList;
      } else if (liType == "select-li") {
        var liID = 'select-' + inputValue.replace(/\W/g,'_') + '-' + ulID;
      } else {
        var liID = 'nonaction-' + ulID + '-' + inputValue.replace(/\W/g,'_');
      }
      li.setAttribute("id", liID);


      var tspan = document.createElement("SPAN");
      var t = document.createTextNode(inputValue);
      tspan.className = "li-contents";
      tspan.appendChild(t);
      li.appendChild(tspan);
      if (inputValue === '') {
        alert("You must write something!"); // CHANGE THIS TO SOMETHING ELSE
      //} else if (inputValue ) {           // DON'T ALLOW DUPLICATES
      } else if (document.getElementById(liID)){
        highlight(document.getElementById(liID));
      } else {
        document.getElementById(ulID).appendChild(li);
        document.getElementById(inputID).value = "";
      }




      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);

      for (i = 0; i < close.length; i++) {
        close[i].onclick = function() {
          var div = this.parentElement;
          toggleParallelItem(div.id,'',true);
          div.remove();         //STORE THIS SOMEWHERE
          getTodayCount();
        }
      }

      //var sublist = document.createElement("SPAN");
      //var subTxt = document.createTextNode("sublist");
      //span.className = "sublist";
      //span.appendChild(subTxt);
      //li.appendChild(sublist);
      //addSublistOption(liID);
      applyCheckedBehavior(liID, inputValue, liType);
      getTodayCount();
    }



    // Applies onclick behavior to item.
      // If regular to-do, selects item and adds to "today".    DONE
      // If today, check off and unselect regular to-do         DONE
      // If either is closed, corresponding one is deleted too  DONE
    function applyCheckedBehavior(liID, inputValue, liType) {
      //console.log('in applyCheckedBehavior!');
      $liItem = $('#'+liID);
      $liItem.click(function() {

          if (liType == "skill-li" || liType == "goal-li") {
            document.getElementById(liID).classList.toggle('goalskill-selected');
          } else {
            toggleParallelItem(liID,inputValue);
            getTodayCount();
          }

       });
    }  


    
    // When a note is deleted, delete the corresponding list item if appropriate
    //function deleteParallelItem(closedID) {
      //$closedElem = $('#'+closedID);
      
      //if ($closedElem.hasClass('select-li')) {
      //    var strippedID = liID.replace('select-', '');
      //    var targetID = 'today-' + strippedID; // Remove the 'today-' and add 'select-'

      //    $('#'+targetID).remove();
      //}


    //}

    function getTodayCount() {
      var count = $('#todayUL li').length;
      var countTxt = document.createTextNode(count);
      document.getElementById('todayCount').innerHTML = count;
    }

    function toggleParallelItem(selectedTaskID,inputValue = '',closing=false) {
        // Select the element using jQuery
        $selectedTask = $('#'+selectedTaskID);
        $selectedUL = $selectedTask.parent().prop("id");

        if ($selectedTask.hasClass("do-li")) {
              document.getElementById(selectedTaskID).classList.toggle('checked-done');
              
              var strippedID = selectedTaskID.replace('today-', '');
              var targetID = 'select-' + strippedID; // Remove the 'today-' and add 'select-'
              $target = $('#'+targetID);

              
              // If item was just checked, also make it checked in the general notes section
              if (closing == true) {
                $target.removeClass('checked-selected');
                $target.removeClass('checked-done');
              //  $target.addClass('unselected-done');              // EVENTUALLY ATTACH "ALL-DONE" OR "KEEP" OPTION
              } else if ($selectedTask.hasClass('checked-done')) {
                $target.addClass('checked-done');
              } else {
                $target.removeClass('checked-done');
              }
          
          } else if ($selectedTask.hasClass("select-li")) {
              if (closing == false) {
                document.getElementById(selectedTaskID).classList.toggle('checked-selected');
              } else {
                $selectedTask.removeClass('checked-selected');
              }
              
              var strippedID = selectedTaskID.replace('select-', '');
              var targetID = 'today-' + strippedID; // Remove the 'select-' and add 'today-'
              $target = $('#'+targetID);


              if ($target.hasClass('checked-done') == true) {
                console.log('do nothing');
              } else if ($selectedTask.hasClass('checked-selected') && closing == false) {        //CLEAN THIS UP
                //console.log("new today list item -- "+inputValue);
                newElement('todayUL','do-li','todayInput',inputValue, $selectedUL);
              } else {
                $target.remove(); // CONSIDER ADDING THIS TO "REMOVED" LIST ON TODAY PANE
              }

          }
    }


    function createList(listName) {

        if (listName === '') {
            alert("Name your list!");
        } else {
              var column = document.createElement("DIV");
              column.className = "col col-sm-6 col-md-4 col-lg-4 list-col";
              column.setAttribute("id", listName.replace(/\W/g,'_') + 'LIST');
              var header = document.createElement("DIV");
              header.className = "header";
              var h2 = document.createElement("H2");
              h2.innerHTML = listName;


              var ul = document.createElement("UL");
              ul.className = "list";
              ul.setAttribute("id", listName.replace(/\W/g,'_') + 'UL');
              var span = document.createElement("SPAN");
              span.className = "btn org-btn add-btn";
              span.innerHTML = "Add";
              span.setAttribute("id", listName.replace(/\W/g,'_')+'Input');
              input = document.createElement("INPUT");
              input.setAttribute("placeholder", "Add a task");
              input.setAttribute("id",listName.replace(/\W/g,'_') + 'ID')

              header.appendChild(h2);
              column.appendChild(header);
              column.appendChild(ul);
              column.appendChild(input);
              column.appendChild(span);

              // Add "delete" option to the list
              //var closeContainer = document.createElement("SPAN");
              //var closeTxt = document.createTextNode("\u00D7");
              //closeContainer.className = "close";                    // MAKE DIFFERENT CLOSE CLASS FOR THIS
              //closeContainer.appendChild(closeTxt);
              //h2.appendChild(closeContainer);


              $listRow = $('.list-row');
              $(column).appendTo($listRow);
              $('#'+span.id).click(function() {
                newElement(ul.id,'select-li',input.id);
              });
              $(closeContainer).click(function() {
                $('#'+column.id).remove();
                                                                     //PUT THIS IN A GARBAGE BIN SO IT CAN STILL BE RETRIEVED
              });

        }

    }

    function removeList(listID, listName) {
      var list = document.getElementByID(listID);
      alert("Are you sure you want to remove "+listName);
      list.remove();

    }

    function highlight(element) {
        $(element).addClass('highlighted');
        setTimeout( function(){
            $(element).removeClass('highlighted');
        },1000);
    }


    function addSublistOption(itemID) {
        $listItem = $('#'+itemID);
        $sublistButton = $('#'+itemID+' .sublist');


        $subListItem.click(function() {

            if ($listItem.hasClass('has-sublist')) {break
                // FIND SUBLIST AND SHOW
                alert('has a sublist!')
            } else {
                createSubList(itemID);
            }

            $listItem.classList.toggle('editing-sublist');
            if ($listItem.hasClass('editing-sublist')) {

            } else {

            }

        });
    }

    function createSubList(parentID) {
        alert('creating new sublist');
        // CREATE UL CALLED '[LI-ID]-SUBLIST'
        // PUT LIST BELOW PARENT LI ITEM
        $('#'+parentID).addClass('has-sublist');
    }


    $("#upload").on("click", function (e) {

        // Create the high level dictionary object structure
        var listAllItems = {
                            'name': {'nickname': 'John'},
                            'lists':
                                    {
                                    'all': [],
                                    'skills': [],
                                    'goals': [],
                                    }
                            };


        // Get the to-do elements from the page
        var doListArray = document.getElementsByClassName('list-col');
        var numberOfLists = doListArray.length;
        console.log('number of lists: '+numberOfLists);

        for (i = 0; i < doListArray.length; i++) {

            $listCategory = $(doListArray[i])
            console.log($listCategory);

            var listName = $listCategory.find('h2').html();
            var listID = $listCategory.find('ul').prop("id");
            var taskList = [];


            taskElementsList = document.getElementById(listID).getElementsByClassName('li');
            //console.log(i + " lists recorded");
            //console.log(taskElementsList);

            for (j = 0; j < taskElementsList.length; j++) {
                console.log("recording list item " + j);
                $liItem = $(taskElementsList[j]);

                if ($liItem.hasClass('checked-selected')) {
                    var selected = "yes";
                } else {
                    var selected = "no";
                }

                taskDict = {
                    'task': $liItem.find('.li-contents').html(),
                    'strippedTask': $liItem.prop("id"),
                    'selected': selected
                };

                taskList.push({
                    taskDict
                });

            }

            listAllItems['lists']['all'].push({
                'listname': listName,
                'strippedname': listID,
                'tasks': taskList
            });

//
        }
//
        dataString = JSON.stringify(listAllItems);
        var str = JSON.stringify(listAllItems, null, 2); // spacing level = 2
        console.log(dataString);

        // Sending the data data to /upload
        $.ajax({
            url: '/_upload/',
            data: dataString,
            contentType: 'application/json',
            dataType: 'json',
            method: 'POST',
            type: 'POST',
            success: function(response) {
                console.log('success! :');
                console.log(responseText);
            },
            error: function(error) {
                console.log('error');
            }
        });
        return false;


    });



    // CODE FOR CREATING NEW LIST. WHEN CREATING NEW LIST, NEED TO MAKE SURE IT HAS: 
    // UNIQUE ID for UL, and UNIQUE ID FOR INPUT, WHICH NEED TO BE PASSED INTO ONCLICK()

    // ALSO NEED TO CREATE NEW COLUMN EACH TIME
