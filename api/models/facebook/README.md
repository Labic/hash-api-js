facebook/post?routing={project_id}
  
```
POST facebook/post?routing=inep
{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}
```

facebook-comments?routing={project_id}&parent={id}
  
```
POST facebook/comments?routing=inep&parent=1
{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}
```