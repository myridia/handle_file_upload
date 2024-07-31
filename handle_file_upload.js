'use strict';

module.exports = class Handle_file_upload {
   constructor(columns, callback)
   {
      this.xlsx = require('./xlsx.full.min.js'); //embedd lib
      this.callback = callback;
      this.columns = columns;
   }

   display_columns()
   {
       console.log(this.columns);
   }

   init()
   {
     let el = document.querySelector(".handle_file_upload");
     el.addEventListener('change', (event) => ((arg1 ,arg2,el, c) => {
    
     let table = this.handle_file_upload(this, el, arg1, arg2);
    })(this.columns, this.callback, el, this));
  }


  handle_file_upload(self, o, columns=[],callback,p)
  {
    this.handle_file_parse_file(self ,o , columns, callback);
  }


  handle_file_parse_file(self, o, columns=[], callback)
  {
    if(!window.File || !window.FileReader || !window.FileList || !window.Blob)
    {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   

    let input = o;
    if (!input)
    {
      alert("Um, couldn't find the fileinput element.");
    }
    else if(!input.files)
    {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0])
    {
      alert("Please select a file before clicking 'Load'");               
    }
    else
    {
      let file = input.files[0];
      let fr = new FileReader();
      fr.readAsBinaryString(file);
      fr.onload = function()
      {
        let _rows = [];
        //let wb = XLSX.read(fr.result,{type: 'binary'});
        let wb = self.xlsx.read(fr.result,{type: 'binary'});
        let s = wb.SheetNames[0];
        //let rows = XLSX.utils.sheet_to_row_object_array(wb.Sheets[s]);
        let rows = self.xlsx.utils.sheet_to_row_object_array(wb.Sheets[s],{"header":1}); //read all including header
        for(let i = 0; i < rows.length; i++)
        {
          let row = [];
          for(let ii in rows[i])
          {
            row.push(rows[i][ii]);
          }
          
          if(row[0] === '')
          {
             console.log("break");
             break;
          }
          _rows.push(row);
        }
        let table = '<table class="select_cols">';
        let cols = 0;
        let body = '';
        for(let i = 0; i < _rows.length; i++)
        {
          body += '<tr>';
          if(_rows[i].length > cols)
          {
            cols = _rows[i].length;
          }
          for(let ii = 0; ii < _rows[i].length; ii++)
          {
            let val  = _rows[i][ii];
            //console.log(val);
            if(typeof(val) === 'string')
            {
              val = val.substring(0, 4) + '...';
            }

            body +='<td>' + val + '</td>';
          }
          body += '</tr>';
          if(i > 300)
          {
            body += '</table>';
            break;
          }
        }

        let head = '<tr>';
        let row = '';
        for(let i = 0; i < cols; i++)
        {
          row = '<th>';
          row += '<select id="select_columns_'+ i + '">';
          row += '<option value="none">None</option>';
     
          for(let c = 0; c < columns.length; c++)
          {
             row += '<option value="'+ columns[c] + '">'+ columns[c] +'</option>';
          }

          row += '</select>';
          row += '</th>';
          head += row;
        }
        head += '</tr>';

        table += head;
        table += body;

        let m = handle_table_modal(table, this);
        m.on('shown.bs.modal', function (e) {
          const t = document.querySelector(".select_cols");
          const w = parseInt(t.offsetWidth)+50;
          let m = document.querySelector(".modal-content");
          m.setAttribute('style', 'width:'+ w +'px;');


          let el = document.querySelector('#btn_insert');
          document.querySelector('#btn_insert').onclick = function(){
	    return handle_file_set_rows(this, m, _rows, cols, callback);
	  }; 
        });

        m.on('hidden.bs.modal', function (e) {
          m.remove();
        });
      };
    }
  }
}

function handle_file_set_rows(o, m, r, cols, callback)
{
  let columns = {};
  for(let i = 0; i < cols; i++)
  {
    
    let _s = document.getElementById('select_columns_'+ i);
    let s = _s.options[_s.selectedIndex].value;

    if( s != 'none')
    {
      if(Object.values(columns).indexOf(s) < 0)
      {
        columns[i] = s;
      }
    }
  }
  

  let data = [];
  let col_model = [];
  for(let i = 0; i < r.length; i++)
  {
     let row = [];
     for( let c in columns)
     {
       row.push(r[i][c]);
     }
    data.push(row);
  }

  for( let c in columns)
  {
    col_model.push(columns[c]);
  }

  callback({'col_model':col_model,'data':data}); 

  jQuery("#modal_table").modal('hide');
}



function handle_table_modal(table)
{
  let popup_template =
  '<div class="modal fade" id="modal_table">' +
  '  <div class="modal-dialog">' +
  '    <div class="modal-content">' +
  '    <div class="modal-header">' +
  '      <button type="button" class="btn btn-primary" id="btn_insert">Insert</button>' +
  '      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="btn_close">Cancel</button>' +
  '    </div>' +
  '      <div class="modal-body" />' + table +  '</div>' +
  '  </div>' +
  '</div>';
  return jQuery(popup_template).modal('show');
}
