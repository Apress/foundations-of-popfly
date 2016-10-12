    componentManager.add("t", "TechnoratiClass", "/content/components/icons/logo.png", "/content/components/icons/logo.png");
    


    function TechnoratiClass()
    {        
    }
    

    TechnoratiClass.prototype.getSearchResults = function(search)
    {
        var api_key = "?key=";
        var callingAPI = "http://api.technorati.com/search";
        
        var apiKey = "3ecba4eb16ecc5c561e5527830677a86"; //"{{Key:key;http://api.technorati.com/}}";

        var reqUrl = callingAPI;
     
        reqUrl += api_key + apiKey;
        reqUrl += "&query=" + search;  // can be link or weblog

        reqUrl += "&format=rss"   // set the returning xml to rss format

        var resultXML = environment.getXml(reqUrl, "technorati");
        
        var resultArray = new Array();
        
        if(resultXML.getElementsByTagName("channel").length >= 1)
        {   
            var errorCheck = resultXML.getElementsByTagName("channel")[0].getElementsByTagName("description")[0].text;
            errorLength = errorCheck.indexOf('Error');
           
            if(!resultXML)
            {
                throw "Sorry, the Technorati block encountered a problem which it could not solve.";
            }
            if(errorLength != -1)
            {
                try
                {
                    throw resultXML.getElementsByTagName("channel")[0].getElementsByTagName("description")[0].text;
                }
                catch(ex)
                {
                    throw "Sorry, the Technorati block encountered a problem which it could not solve.";            
                }
            }
            else
            {    
                var itemNodeList = resultXML.getElementsByTagName('item');
                var resultNodeCount = itemNodeList.length;            
                var resultArray  = new Array(resultNodeCount);
                 
                if(!resultNodeCount || resultNodeCount < 1)
                {
                    throw "Sorry, it seems that the Techorati search results does not contain any items.";                 
                }
                
                for(var i = 0; i < resultNodeCount; i++)
                {   
                    var itemNode = itemNodeList[i];
                    if(itemNode)
                    {                
                        var title =         itemNode.getElementsByTagName("title").length >= 1 ?        itemNode.getElementsByTagName("title")[0].text : "";
                        var source =        itemNode.getElementsByTagName("source").length>= 1 ?        itemNode.getElementsByTagName("source")[0].text : "";
                        var sourceLink =    itemNode.getElementsByTagName("source").length>= 1 ?        itemNode.getElementsByTagName("source")[0].getAttribute("url") : "";
                        var link =          itemNode.getElementsByTagName("link").length >= 1 ?         itemNode.getElementsByTagName("link")[0].text : "";
                        var description =   itemNode.getElementsByTagName("description").length >= 1 ?  itemNode.getElementsByTagName("description")[0].text : "";
                        var author =        itemNode.getElementsByTagName("author").length >= 1 ?       itemNode.getElementsByTagName("author")[0].text : "";
                        var tags =          itemNode.getElementsByTagName("tags").length >= 1 ?         itemNode.getElementsByTagName("tags")[0].text : "";
                        var comments =      itemNode.getElementsByTagName("comments").length >= 1 ?     itemNode.getElementsByTagName("comments")[0].text : "";
                        var commentRss =    itemNode.getElementsByTagName("wfw:commentRss");
                        
                        if(commentRss.length == 0)
                            commentRss = itemNode.getElementsByTagName("commentRss");

                        if(commentRss && commentRss.length > 0)
                            commentRss = commentRss[0].text;
                        
                        var pubDate =       itemNode.getElementsByTagName("pubDate").length >= 1 ?      itemNode.getElementsByTagName("pubDate")[0].text : "";
                        var mediaLink =     itemNode.getElementsByTagName("enclosure").length>= 1 ?     itemNode.getElementsByTagName("enclosure")[0].getAttribute("url") : "";
                        var mediaType =     itemNode.getElementsByTagName("enclosure").length>= 1 ?     itemNode.getElementsByTagName("enclosure")[0].getAttribute("type") : "";
                            
                        var lat =           itemNode.getElementsByTagName("geo:lat");
                        var lon =           itemNode.getElementsByTagName("geo:long");
                        
                        if(lat && lat.length == 0)
                            lat = itemNode.getElementsByTagName("lat");

                        if(lat && lat.length > 0)
                            lat = lat[0].text;
                            
                        if(lon && lon.length == 0)
                            lon = itemNode.getElementsByTagName("long");

                        if(lon && lon.length > 0)                        
                            lon = lon[0].text;
                       
                        resultArray[i] = new RSSItem(title, link, description, source, sourceLink,  author, tags, comments, commentRss, pubDate, mediaLink, mediaType, lat, lon);
                    }
                }
                
                return resultArray; 
            }
        } 
        else
        {          
         
           
            return resultArray;  
        }  
    }
    
    function RSSItem(title, link, description, source, sourceLink, author, tags, comments, commentRss, pubDate, mediaLink, mediaType, lat, lon)
    {
        this.title = title;
        this.link = link;
        this.description = description;
        this.source= source;  
        this.sourceLink= sourceLink;   
        this.author = author;
        this.tags= tags;  
        this.comments = comments;
        this.commentRss = commentRss;    
        this.publishedDate = pubDate;
        this.mediaLink = mediaLink;   
        this.mediaType = mediaType;
        this.latitude = lat;
        this.longtitude = lon;
    }

    RSSItem.prototype.toString = function() {

        var html = "";
        
        html += "<strong>" + this.title + "</strong>";
        html += "<br /><font style='font-size: xx-small'>"+ this.publishedDate +"</font>" + "\n"; 
        html += "<p>"+ this.description +"</p><hr/>";
        
        return html;
    };

