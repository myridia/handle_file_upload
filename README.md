# handle_file_upload
Handle File Uploads lets you select the columns of a CSV, XLS or XLSX file.
It will return the selected columns for your import.
Demo:
https://hfp.calantas.org


#Usage:
Add a script import tag to your project:

```
<script src="node_modules/handle_file_upload/dist/handle_file_upload.js"></script>
```

Add this to your js grid declaration:

example:

```
h = new Handle_file_upload(columns, mycallback);
h.init();
}

function mycallback(data)
{
  console.log(data);
}


```
supported formats: csv, xlsx, xls
