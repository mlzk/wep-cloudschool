/* 
* @Author: 会飞的猫
* @Date:   2016-06-06 09:24:39
* @Last Modified by:   会飞的猫
* @Last Modified time: 2016-06-06 10:26:57
*/


jQuery.fn.extend({
    LoadMore:function(){
          
        var myScroll, 
            pullUpEl,
            pullUpOffset, 
            _maxScrollY;
    
        var generatedCount = 0;
        var $this = $(this);
        var ListUl = $this.children().children('ul');
        var pullUp = $this.find(".pullUp");
        console.info($this.attr('class'));
        console.log(ListUl);
        console.log($this.attr("class"));

function pullUpAction () {
    setTimeout(function () {    // <-- Simulate network congestion, remove setTimeout from production!
        var el, li, i;
        el = ListUl;
         // console.log(ListUl.attr("class"));

        for (i=0; i<3; i++) {
            li = document.createElement('li');
            li.innerHTML = '(Pull up) Generated row ' + (++generatedCount);//Firefox  does not suppose innerText, use innerHTML instead.
            el.appendChild(li, el.childNodes[0]);
        }
        if(myScroll){
            myScroll.refresh();     // Remember to refresh when contents are loaded (ie: on ajax completion)
        }
    }, 1000);   // <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {


    console.log($this.attr("class"));
    if(myScroll!=null){
        myScroll.destroy();
    }

    pullUpEl = pullUp;
    if (pullUpEl) {
        pullUpOffset = pullUpEl.offsetHeight;
    } else {
        pullUpOffset = 0;
    }
    
    //Options of IScroll
    var myOptions = {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true,
            probeType:1,
            lockPullDown:true
        };
        console.log($this.length);

        // for(var i=0; i<$this.length; i++){
            
        //      myScroll = new IScroll($this.eq(i),myOptions);

        // }

   myScroll = new IScroll($this,myOptions);
    _maxScrollY = myScroll.maxScrollY = myScroll.maxScrollY + pullUpOffset;
    
    var isScrolling = false;
    
    //Event: scrollStart
    myScroll.on("scrollStart", function() {
        if(this.y==this.startY){
            isScrolling = true;
        }
        console.log('start-y:'+this.y);
    });
    
    //Event: scroll
    myScroll.on('scroll', function(){
        if (this.y <= (_maxScrollY - pullUpOffset) && pullUpEl && !pullUpEl.className.match('flip')) {
            pullUpEl.className = 'flip';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh';
            //this.maxScrollY = this.maxScrollY;
            this.maxScrollY = this.maxScrollY - pullUpOffset;
        } else if (this.y > (_maxScrollY - pullUpOffset) && pullUpEl && pullUpEl.className.match('flip')) {
            pullUpEl.className = '';
            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more';
            //this.maxScrollY = pullUpOffset;
            this.maxScrollY = this.maxScrollY + pullUpOffset;
        }
    });
    
    //Event: scrollEnd
    myScroll.on("scrollEnd", function() {
        console.log('scroll end'); 
        console.log('directionY:'+this.directionY);
        if (pullUpEl && pullUpEl.className.match('flip')) {
                console.log('pull up loading'); 
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';    
                // Execute custom function (ajax call?)
                if (isScrolling) {          
                    console.log('before pull up action:'+this.y); 
                    pullUpAction(); 
                    console.log('after pull up action:'+this.y); 
                }
        }
        isScrolling = false;
    });
    
    //Event: refresh
    myScroll.on("refresh", function() {
         
         console.log('maxScrollY-4:'+this.maxScrollY);
         _maxScrollY = this.maxScrollY = this.maxScrollY+pullUpOffset;
         console.log('maxScrollY-5:'+this.maxScrollY);
         
        if (pullUpEl && pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more';
                this.scrollTo(0,this.maxScrollY,0);
         }
         
         console.log('refresh finished!'); 
    });
    
    // setTimeout(function () { document.getElementById('wrapper1').style.left = '0'; }, 500);
    
}
loaded()

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);










    }
})



