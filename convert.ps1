$content = Get-Content 'New Microsoft Word Document.txt' -Raw
$content | Out-File 'code.txt' -Encoding UTF8
