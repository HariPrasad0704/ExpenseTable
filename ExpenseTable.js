
$(document).ready(function() {
    console.log("After docu is loaded");

    var table = $('#expenseTable').DataTable({
        "lengthMenu": [ 3, 5, 10 ],
        "pageLength": 3,
        paging: true,
        ordering: false,
        info: true,
        searching: false,
        columnDefs: [
            {
                targets: -3,
                className: 'dt-body-right',
            },
        ],
        columns: [
            {
                data: "ExpenseId",
                render: function(data, type, row) {
                    console.log(data);
                    console.log(type);
                    console.log(row);
                    return '<i class="fa fa-id-card-o" aria-hidden="true"></i>' + " " + data;
                },
            },
            {data: "Description"},
            {data: "Amount"},
            {data: "Status",
            render: function(data,type,row){
                if(row.Status==='Completed'){
                    return  data+"  "+'<iconify-icon icon="fluent-mdl2:completed-solid" id="completedIcon" style="color: #16FF00;"></iconify-icon>';

                }
                if(row.Status==='InProgress'){
                    return data+"  "+'<iconify-icon icon="carbon:in-progress"  id="progressIcon" style="color: #ffed00;"></iconify-icon>'
                }
                if(row.Status==='Submitted'){
                    return data+"  "+'<iconify-icon icon="iconoir:submit-document" id="submittedIcon" style="color: #4942e4;"></iconify-icon>'
                }

                return data +"  "+'<iconify-icon icon="material-symbols:draft-orders-rounded" id="draftIcon" style="color: #4A403A;"></iconify-icon>';
               
            }},
            {
                data: "Action",
                render: function(data, type, row) {
                    var role = $('#role').val();
                    var status = row.Status;
            
                    if (role === 'admin') {
                        return data;
                    } else if (role === 'employee' && status !== 'Completed') {
                        return '<i class="fa fa-pencil-square-o " id="editbtn" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-trash" id="deleteBtn" aria-hidden="true"></i>';
                    } else {
                        return '';
                    }
                },
            },
            
            
            
        ],
    });
    $('#totalAmount').text(table.column(2).data().sum().toFixed(2));
  

    
    // $('#role').on('change', function() {
    //     var role = $(this).val();
    //     if (role === 'admin') {
    //         // Show delete button
    //         table.columns(-1).visible(true);
    //         // Enable expenseId and status fields
    //         $('#expenseId').prop('readonly', false);
    //         $('#status').prop('disabled', false);
    //         $("#deleteBtn").show();
    //     } else {
    //         // Hide delete button
    //         table.columns(-1).visible(true);
    //         // Disable expenseId and status fields
    //         $('#expenseId').prop('readonly', true);
    //         $('#status').prop('disabled', true);
    //         $("#deleteBtn").hide();
    //     }
    // });



    // $('#role').on('change', function() {
    //     var role = $(this).val();
    //     if (role === 'admin') {
    //         table.columns(-1).visible(true);
    //         $('#expenseId').prop('readonly', false);
    //         $('#status').prop('disabled', false);
    //         table.column(-1).nodes().to$().find('#editbtn').show();
    //         table.column(-1).nodes().to$().find('#deleteBtn').show();
    //     } else if (role === 'employee') {
    //         table.columns(-1).visible(true);
    //         $('#expenseId').prop('readonly', true);
    //         $('#status').prop('disabled', true);
    //         table.column(-1).nodes().to$().find('#editbtn').show();
    //         table.column(-1).nodes().to$().find('#deleteBtn').show();
    //     }
    // });

    $('#role').on('change', function() {
        var role = $(this).val();
        var rows = table.rows().nodes();
    
        if (role === 'admin') {
            $(rows).find('#editbtn').show();
            $(rows).find('#deleteBtn').show();
        } else if (role === 'employee') {
            $(rows).each(function() {
                var status = table.row(this).data().Status;
                if (status !== 'Completed') {
                    $(this).find('#editbtn').show();
                    $(this).find('#deleteBtn').show();
                } else {
                    $(this).find('#editbtn').hide();
                    $(this).find('#deleteBtn').hide();
                }
            });
        }
    });
    
    
    

    $("#addbtn").on('click', function() {
        console.log("add btn is clicked");
        $("#addExpenseModalLabel").text("Enter Expense Data");
 
        console.log(role.value);
        if(role.value==='admin'){
            $("#ExpenseModal").show();
            $("#form").show();
            $("#submitModalBtn").show();
            $("#saveModalBtn").hide();
            $("#expenseId").val(generateExpenseId());
            $("#expenseId").prop("readonly", false);
            $("#status").prop("disabled", false);
        }
        if(role.value==='employee'){
            $("#ExpenseModal").show();
            $("#form").show();
            $("#submitModalBtn").show();
            $("#saveModalBtn").hide();
            $("#expenseId").val(generateExpenseId());
            $("#expenseIdDiv").show();
            $("#statusDiv").show();
            $("#expenseId").prop("readonly", true);
            $("#status").prop("disabled", true);
        }
      
    });

    $("#cancelModalBtn").on('click',function(){
        $("#ExpenseModal").hide();
        $("#form")[0].reset();
        $("$form").hide();
    });
    $("#cancelsign").on('click',function(){
        $("#ExpenseModal").hide();
        $("#form")[0].reset();
        $("#form").hide();
    });
    // $("#submitModalBtn").on('click',function(e){
    //     e.preventDefault();
    //     if(validateForm()){
    //     var expenseId = $('#expenseId').val();
    //     var description = $('#description').val();
    //     var amount = parseFloat($('#amount').val());
    //     var status=$('#status').val();
    //     console.log(expenseId,description,amount,status);
        

    //     table.row.add([expenseId,description,amount,status,'<button class="btn btn-info id" id="editbtn"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>&nbsp;&nbsp;<button class="btn btn-danger" id="deleteBtn"><i class="fa fa-trash" aria-hidden="true"></i></button>']).draw();

    //     $('#totalAmount').text(table.column(2).data().sum());
    //     $("#form")[0].reset();
    //     $("#form").hide();
    //     $("#ExpenseModal").hide();
    //     Swal.fire("Row is added ");
    //     }

    // });


    $("#submitModalBtn").on('click', function(e) {
        e.preventDefault();
        if (validateForm()) {
            var expenseId = $('#expenseId').val();
            var description = $('#description').val();
            var amount = parseFloat($('#amount').val());
            var status = $('#status').val();
            console.log(expenseId, description, amount, status);
            var newData={};
            if(role.value=='admin'){
                 newData = {
                    "ExpenseId": expenseId,
                    "Description": description,
                    "Amount": amount,
                    "Status": status,
                    "Action": '<i class="fa fa-pencil-square-o" id="editbtn" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-trash" id="deleteBtn" aria-hidden="true"></i>'
                };
            }
            if(role.value=='employee'){
                newData = {
                    "ExpenseId": expenseId,
                    "Description": description,
                    "Amount": amount,
                    "Status": status,
                    "Action": '<i class="fa fa-pencil-square-o" id="editbtn" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-trash" id="deleteBtn" aria-hidden="true"></i>'
                };
            }
           
    
            table.row.add(newData).draw();
            $('#totalAmount').text(table.column(2).data().sum().toFixed(2));
            $("#form")[0].reset();
            $("#form").hide();
            $("#ExpenseModal").hide();
            Swal.fire("Row is added");
        }
    });
    

    $("#expenseTable tbody").on("click", "#deleteBtn", function() {
        console.log("Inside delete btn...");
        Swal.fire({
            title: 'Do you really want to delete this row?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
            table.row($(this).closest("tr")).remove().draw();
            $('#totalAmount').text(table.column(2).data().sum().toFixed(2));
            Swal.fire(
                'Deleted!',
                'Row has been deleted.',
                'success'
              )
            }
        });
       
       
    });

    var rowData={};
    var selectedRow;
    $("#expenseTable tbody").on('click', "#editbtn", function() {
 
        selectedRow = $(this).closest("tr");
        rowData = table.row(selectedRow).data();
        console.log(rowData);//Object{}
        $("#addExpenseModalLabel").text("Edit Expense Data");
        // document.getElementById('savebtn').style.visibility="visible";
       if(role.value==='admin'){
        $('#expenseIdDiv').show();
        $('#statusDiv').show();
        $('#expenseId').prop("readonly",false);
        $('#status').prop("disabled",false);
        $("#expenseId").val(rowData.ExpenseId);
    //    $("#expenseId").prop("readonly",true);
        $("#description").val(rowData.Description);
        $("#amount").val(rowData.Amount);
        $("#status").val(rowData.Status);
    //    $("#status").prop("disabled",true);
    $("#ExpenseModal").show();
    $('#form').show();
    $('#submitModalBtn').hide();
    $('#saveModalBtn').show();
       } 
       if(role.value==='employee'){
        $("#expenseIdDiv").hide();
        $("#statusDiv").hide();
       $("#expenseId").val(rowData.ExpenseId);
  //    $("#expenseId").prop("readonly",true);
      $("#description").val(rowData.Description);
      $("#amount").val(rowData.Amount);
      $("#status").val(rowData.Status);
  //    $("#status").prop("disabled",true);

  $("#ExpenseModal").show();
  $('#form').show();
  $('#submitModalBtn').hide();
  $('#saveModalBtn').show();
       }
         
        
      
    });


    // $("#saveModalBtn").on("click", function(event) {
    //      event.preventDefault();
    //     if(validateForm()){
    //     // Update the row data with the edited values
    //     var expenseId = $('#expenseId').val();
    //         var description = $('#description').val();
    //         var amount = parseFloat($('#amount').val());
    //         var status = $('#status').val();
    //         console.log(expenseId, description, amount, status);
    
    //         var editData = {
    //             "ExpenseId": expenseId,
    //             "Description": description,
    //             "Amount": amount,
    //             "Status": status,
    //             "Action": '<i class="fa fa-pencil-square-o" id="editbtn" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-trash" id="deleteBtn" aria-hidden="true"></i>'
    //         };
    
    //         table.row().add(editData).draw();
     
    //     $('#totalAmount').text(table.column(2).data().sum().toFixed(2));
    //     //$("#form").trigger("reset");
    //     $("#form")[0].reset();
    //     $("#ExpenseModal").hide();
    //     }
    // });    

    $("#saveModalBtn").on("click", function(event) {
        event.preventDefault();
        if (validateForm()) {
            // Update the row data with the edited values
            var expenseId = $('#expenseId').val();
            var description = $('#description').val();
            var amount = parseFloat($('#amount').val());
            var status = $('#status').val();
            console.log(expenseId, description, amount, status);
    
            // Get the existing data for the selected row
            var rowData = table.row(selectedRow).data();
    
            // Update the specific fields with the edited values
            rowData.ExpenseId = expenseId;
            rowData.Description = description;
            rowData.Amount = amount;
            rowData.Status = status;
    
            // Redraw the updated row
            table.row(selectedRow).data(rowData).draw();
    
            $('#totalAmount').text(table.column(2).data().sum().toFixed(2));
            $("#form")[0].reset();
            $("#ExpenseModal").hide();
        }
    });
    

     
      function generateExpenseId() {
        var currentDate = new Date();
        var year = currentDate.getFullYear().toString().substring(2);
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var date = currentDate.getDate().toString().padStart(2, '0');
        var hours = currentDate.getHours().toString().padStart(2, '0');
        var minutes = currentDate.getMinutes().toString().padStart(2, '0');
        var expenseId = 'E' + date + month + '-' + hours + ':' + minutes;
        return expenseId;
      }
      
      

    function validateForm() {
        var expenseId = $('#expenseId').val();
        var description = $('#description').val();
        var amount = $('#amount').val();

        
        if (expenseId.trim() === '' ) {
            Swal.fire('Expense ID is required.');
            return false;
        }
        if (description.trim() === '') {
            Swal.fire('Description is required.');
            return false;
        }
        if (amount.trim() === '' || isNaN(parseFloat(amount))|| (parseFloat(amount)<0) ) {
            Swal.fire('Amount must be a valid number.');
            return false;
        }

        return true;
    }


});
