// Copyright 2009 DW Inc.
// All Rights Reserved.

/**
 * @fileoverview kyodai.js is a library of of classes and utilies that
 * are used in kyodai game.
 * @author hyramduke@google.com (Hyram Duke)
 */

// Namespace assigned to this library of kyodai-related classes
var kyodai = {mapX:19, mapY:11, mapLength:14};

kyodai.area = 'private';
//kyodai.area = 'public';
kyodai.imageshost = 'http://dw-kyodai.googlecode.com/svn/trunk/images/';
kyodai.scene = 'tooth';

kyodai.getCachedImage =	function(src) {
  if (kyodai.area == 'public'){
    return _IG_GetImageUrl(kyodai.imageshost+src);
  }
  else{
    return ('images/' + src);
  }
}

/**
 * draw the cross from a point in the map
 * @param {Number} x The x coordinate of the point.
 * @param {Number} y The y coordinate of the point.
 * @return {Number} The cross.
 */   
kyodai.cross = function(x, y)
{
  for (var x1=x-1; x1>-1; x1--)
    if (kyodai.block[x1+ "," +y]) break;

  for (var x2=x+1; x2<kyodai.mapX; x2++)
    if (kyodai.block[x2+ "," +y]) break;

  for (var y1=y-1; y1>-1; y1--)
    if (kyodai.block[x+ "," +y1]) break;

  for (var y2=y+1; y2<kyodai.mapY; y2++)
    if (kyodai.block[x+ "," +y2]) break;

  return {x1:x1, x2:x2, y1:y1, y2:y2};
}

/**
 * determine whether two blocks could be connected in x direction
 * @param {Number} x1 The x coordinate of first point.
 * @param {Number} x2 The x coordinate of second point.
 * @param {Number} y The y coordinate of these two point.
 * @return {boolean} True or False.
 */  
kyodai.passx = function(x1,x2,y)
{
  if (x1 < x2){
    while (++x1 < x2)
      if (kyodai.block[x1+ "," +y]) return false;
  }
  else{
    while (++x2 < x1)
      if (kyodai.block[x2+ "," +y]) return false;
  }
  return true;
}

/**
 * determine whether two blocks could be connected in y direction
 * @param {Number} y1 The y coordinate of first point.
 * @param {Number} y2 The y coordinate of second point.
 * @param {Number} x The x coordinate of these two point.
 * @return {boolean} True or False.
 */  
kyodai.passy = function(y1,y2,x)
{
  if (y1 < y2){
    while (++y1 < y2)
      if (kyodai.block[x+ "," +y1]) return false;
  }
  else{
    while (++y2 < y1)
      if (kyodai.block[x+ "," +y2]) return false;
  }
  return true;
}

/**
 * draw the line between two blocks in x direction
 * @param {Number} x1 The x coordinate of first point.
 * @param {Number} x2 The x coordinate of second point.
 * @param {Number} y The y coordinate of these two point.
 * @return {array} the path.
 */  
kyodai.linex = function(x1, x2, y)
{
  var path = [];
  if (x1 < x2)
  {
    while (x1++ < x2)
    path.push('<img src="'+kyodai.getCachedImage('linex.png')+'" style="position:absolute;left:'+(x1*35-17)+'px;top:'+y*35+'px"/>');
  }
  else
  {
    while (x2++ < x1)
    path.push('<img src="'+kyodai.getCachedImage('linex.png')+'"  style="position:absolute;left:'+(x2*35-17)+'px;top:'+y*35+'px"/>');
  }
  return path;
}

/**
 * draw the line between two blocks in y direction
 * @param {Number} y1 The y coordinate of first point.
 * @param {Number} y2 The y coordinate of second point.
 * @param {Number} x The x coordinate of these two point.
 * @return {array} the path.
 */  
kyodai.liney = function(y1, y2, x)
{
  var path = [];
  if (y1 < y2)
  {
    while (y1++ < y2)
    path.push('<img src="'+kyodai.getCachedImage('liney.png')+'" style="position:absolute;left:'+x*35+'px;top:'+(y1*35-17)+'px"/>');
  }
  else
  {
    while (y2++ < y1)
    path.push('<img src="'+kyodai.getCachedImage('liney.png')+'" style="position:absolute;left:'+x*35+'px;top:'+(y2*35-17)+'px"/>');
  }
  return path;
}

/**
 * find the way that connect two blocks
 * @param {Number} sx The x coordinate of first point.
 * @param {Number} sy The y coordinate of first point.
 * @param {Number} ex The x coordinate of second point.
 * @param {Number} ey The y coordinate of second point.
 * @return {array} the path.
 */  
kyodai.find = function(sx,sy,ex,ey)
{
  // draw cross from first point
  var s = kyodai.cross(sx, sy);
  // if the cross of first point passes the second point
  if (sy==ey && s.x1<ex && ex<s.x2) return kyodai.linex(sx, ex, sy);
  if (sx==ex && s.y1<ey && ey<s.y2) return kyodai.liney(sy, ey, sx);
  // draw cross from first point
  var e = kyodai.cross(ex, ey);
  // if the cross of first point passes the cross of second point
  var x1 = s.x1 < e.x1 ? e.x1 : s.x1;
  var x2 = s.x2 > e.x2 ? e.x2 : s.x2;
  var y1 = s.y1 < e.y1 ? e.y1 : s.y1;
  var y2 = s.y2 > e.y2 ? e.y2 : s.y2;
  // if the cross of second point passes the first point
  if (x1<sx && sx<x2 && y1<ey && ey<y2)
    return kyodai.liney(sy, ey, sx).concat(kyodai.linex(sx, ex, ey));
  if (x1<ex && ex<x2 && y1<sy && sy<y2)
    return kyodai.liney(sy, ey, ex).concat(kyodai.linex(sx, ex, sy));
  // if the cross of two points in the same line in x direction
  if (sx < ex)
  {
    var x3 = sx;
    var x4 = ex;
    var s1 = sy;
    var e1 = ey;
  }
  else
  {
    var x3 = ex;
    var x4 = sx;
    var s1 = ey;
    var e1 = sy;
  }
  for (var x=x3+1; x<x4; x++)
  {
    if (x1<x && x<x2 && kyodai.passy(s1, e1, x))
    {
      return kyodai.liney(s1, e1, x).concat(kyodai.linex(x3, x, s1), kyodai.linex(x, x4, e1));
    }
  }
  // if the cross of two points in the same line in y direction
  if (sy < ey)
  {
    var y3 = sy;
    var y4 = ey;
    var s2 = sx;
    var e2 = ex;
  }
  else
  {
    var y3 = ey;
    var y4 = sy;
    var s2 = ex;
    var e2 = sx;
  }
  for (var y=y3+1; y<y4; y++)
  {
    if (y1<y && y<y2 && kyodai.passx(s2, e2, y))
    {
      return kyodai.linex(s2, e2, y).concat(kyodai.liney(y3, y, s2), kyodai.liney(y, y4, e2));
    }
  }
  s1 = true;
  e1 = true;
  s2 = true;
  e2 = true;
  // spread the rectangle composed by the cross of two points
  while (s1 || e1 || s2 || e2)
  {
    if (s1)
    {
      if (x1 < --x3 && x3 < x2)
      {
        if (kyodai.passy(sy, ey, x3))
        {
          return kyodai.liney(sy, ey, x3).concat(kyodai.linex(x3, sx, sy), kyodai.linex(x3, ex, ey));
        }
      }
      else s1 = false;
    }
    if (e1)
    {
      if (x1 < ++x4 && x4 < x2)
      {
        if (kyodai.passy(sy, ey, x4))
        {
          return kyodai.liney(sy, ey, x4).concat(kyodai.linex(x4, sx, sy), kyodai.linex(x4, ex, ey));
        }
      }
      else e1 = false;
    }
    if (s2)
    {
      if (y1 < --y3 && y3 < y2)
      {
        if (kyodai.passx(sx, ex, y3))
        {
          return kyodai.linex(sx, ex, y3).concat(kyodai.liney(y3, sy, sx), kyodai.liney(y3, ey, ex));
        }
      }
      else s2 = false;
    }
    if (e2)
    {
      if (y1 < ++y4 && y4 < y2)
      {
        if (kyodai.passx(sx, ex, y4))
        {
          return kyodai.linex(sx, ex, y4).concat(kyodai.liney(y4, sy, sx), kyodai.liney(y4, ey, ex));
        }
      }
      else e2 = false;
    }
  }
  return false;
}

/**
 * load the game map
 * @param {string} txturl The url of the game map.
 */  
kyodai.loadmap = function(mapnum)
{
  kyodai.block = {};
  kyodai.shape = [];
  var map = ['1-------111-------1\n-1-111111-111111-1-\n--111-111-111-111--\n--11--111-111--11--\n--11-111---111-11--\n-------------------\n--11-111---111-11--\n--11--111-111--11--\n--111-111-111-111--\n-1-111111-111111-1-\n1-------111-------1',
             '-1-1-1-1-1-1-1-1-1-\n1-1-1-1-1-1-1-1-1-1\n-1-1-1-1-1-1-1-1-1-\n1-1-1-1-1-1-1-1-1-1\n-1-1-1-1-1-1-1-1-1-\n1-1-1-1-1-1-1-1-1-1\n-1-1-1-1-1-1-1-1-1-\n1-1-1-1-1-1-1-1-1-1\n-1-1-1-1-1-1-1-1-1-\n1-1-1-1-1-1-1-1-1-1\n-1-1-1-1-1-1-1-1-1-',
             '1-------111-------1\n-1-111111-111111-1-\n--111-111-111-111--\n--11--111-111--11--\n--11-111---111-11--\n-------------------\n--11-111---111-11--\n--11--111-111--11--\n--111-111-111-111--\n-1-111111-111111-1-\n1-------111-------1',
             '-------------------\n----11111-11111----\n---111111-111111---\n--111111---111111--\n-111111-----111111-\n-------------------\n-111111-----111111-\n--111111---111111--\n---111111-111111---\n----11111-11111----\n-------------------',
             '---1-----1-----1---\n--111---111---111--\n-11111-11111-11111-\n--111---111---111--\n---1-----1-----1---\n-------------------\n-11-11-11-11-11-11-\n-1---1-1---1-1---1-\n---1-----1-----1---\n-1---1-1---1-1---1-\n-11-11-11-11-11-11-',
             '11--1--11111--1--11\n1--1--1-----1--1--1\n1-1--1--111--1--1-1\n1-1-1--1---1--1-1-1\n1-1-1-1-----1-1-1-1\n1-1-1-1-----1-1-1-1\n1-1-1-1-----1-1-1-1\n1-1-1--1---1--1-1-1\n1-1--1--111--1--1-1\n1--1--1-----1--1--1\n11--1--11111--1--11',
             '-1----111-111----1-\n-11---111-111---11-\n--11---11111---11--\n---11---111---11---\n1---11---1---11---1\n11---11-----11---11\n1---11---1---11---1\n---11---111---11---\n--11---11111---11--\n-11---111-111---11-\n-1----111-111----1-',
             '11111---------11111\n111111-------111111\n-111111-----111111-\n--11111-----11111--\n-------------------\n-------------------\n-111-1-1-1-1-1-111-\n---1-1-1-1-1-1-1---\n---11-1-1-1-1-11---\n----11111111111----\n---------1---------',
             '1111111111111111111\n1-----------------1\n1-111111111111111-1\n1-1-------------1-1\n1-1-1111111111--1-1\n1-1-1-----------1-1\n1-1-1111111111111-1\n1-1---------------1\n1-11111111111111111\n1------------------\n1111111111111111111',
             '-------------------\n---1--1111111--1---\n--11-1111-1111-11--\n-111-111---111-111-\n-111-11-----11-111-\n-1-1-11-----11-1-1-\n-111-11-----11-111-\n-111-111---111-111-\n--11-1111-1111-11--\n---1--1111111--1---\n-------------------',
             '---111111111111111-\n--11111111111111111\n--11---------------\n--11--1111111111---\n--11--11111111111--\n--11-----------11--\n--11111111111--11--\n---1111111111--11--\n---------------11--\n11111111111111111--\n-111111111111111---',
             '---1111111111111111\n-1-11----1---1--1-1\n1--11----1---1--1-1\n1-111----1---1--1-1\n11111----1---1--1-1\n-111111111111111111\n11111----1---1--1-1\n1-111----1---1--1-1\n1--11----1---1--1-1\n-1-11----1---1--1-1\n---1111111111111111',
             '---11-------1111---\n--1111-----111111--\n-111111---11111111-\n11-11-11---111111--\n---11-------1111---\n---11--------11----\n--1111----11111111-\n-111111---11111111-\n11111111-----11----\n-111111------11----\n--1111-------11----',
             '1-------111-------1\n-1-111111-111111-1-\n--111-111-111-111--\n--11--111-111--11--\n--11-111---111-11--\n-------------------\n--11-111---111-11--\n--11--111-111--11--\n--111-111-111-111--\n-1-111111-111111-1-\n1-------111-------1'];
  var blocks = map[mapnum].split("\n");
  blen = blocks.length;
  bxlen = blocks[0].length;
  for(var x=0; x<blen; x++)
  {
    bx = blocks[x];
    for(var y=0; y<bxlen; y++)
    {
      if (bx.charAt(y) == "1")
      {
        kyodai.shape.push({x:y, y:x});
      }
    }
  }
  var items = [];
  var itemppt = kyodai.random([1, 2, 3, 4, 5, 6, 7, 8]);
  var n = 2;
  var num = kyodai.shape.length;
  for (var i=0; i<8; i++)
  {
    if (items.length==28) n=1;
    if (items.length==30) break;
    for (var j=Math.floor(Math.random()*n)*2+2; j>0; j--)
    {
      items.push(itemppt[i]);
    }
  }
  
  for (n=9; n<42; n++)
  {
    if (num-items.length < 3)
    {
      if (num == items.length) break;
      else
      {
        items.push(n);
        items.push(n);
        break;
      }
    }
    items.push(n);
    items.push(n);
    items.push(n);
    items.push(n);
  }
  $("#kyodai_remain").html('Remain : ' + num);
  kyodai.remain = num;
  kyodai.setting(items);
  kyodai.count();
}

/**
 * preload the pics of blocks
 */ 
kyodai.preload = function()
{
  $("#kyodai_game").attr('src', kyodai.getCachedImage('game1.jpg'));
  $("#kyodai_choose").attr('src', kyodai.getCachedImage('choose.png'));
  $("#kyodai_hover").attr('src', kyodai.getCachedImage('choose.png'));
  $("#kyodai_count img").attr('src', kyodai.getCachedImage('count.png'));
  $("#kyodai_ppt img").attr('src', kyodai.getCachedImage('notool.png'));
  
  var itemImg = [];
  for (i=0; i<42; i++)
  {
    itemImg.push('<img class="preload" src="'+ kyodai.getCachedImage(kyodai.scene+'/'+ i + '.png') +'">');
    itemImg.push('<img class="preload" src="'+ kyodai.getCachedImage('linex.png') +'">');
    itemImg.push('<img class="preload" src="'+ kyodai.getCachedImage('liney.png') +'">');
  }
  
  for (i=1; i<6; i++)
  {
    itemImg.push('<img class="preload" src="'+ kyodai.getCachedImage('tool'+ i + '.png')+'">');
    itemImg.push('<img class="preload" src="'+ kyodai.getCachedImage('tool_num_'+ i + '.png')+'">');
  }
  itemImg.push('<img class="preload" src="'+ kyodai.getCachedImage('start_btn_hover.png')+'">');
  
  $("#kyodai_preload").html(itemImg.join(""));
}

/**
 * load the pics of blocks
 * @param {array} The array of blocks.
 */ 
kyodai.setting = function(arr)
{
  var itemImg = [];
  kyodai.shape = kyodai.random(kyodai.shape);
  for (i=0; i<kyodai.shape.length; i++)
  {
    var Img = arr[i];
    x = kyodai.shape[i].x;
    y = kyodai.shape[i].y;
    kyodai.block[x+","+y] = Img;
    if (Img)
    {
      itemImg.push('<img id=Item_'+x+'_'+y+' class ="block_item" src="'+ kyodai.getCachedImage(kyodai.scene+'/'+ Img + '.png')+'" style="z-index:'+ (100-x+y) +';position:absolute;left:'+ x*35 +'px;top:'+ y*35 +'px">');
    }
  }
  $("#kyodai_items").html(itemImg.join(""));
  
  $(".block_item").click(function() {
    kyodai.click($(this).position().left, $(this).position().top);
	});
  $(".block_item").hover(
    function () {
      $("#kyodai_hover").css("left",($(this).position().left) + "px");
      $("#kyodai_hover").css("top",($(this).position().top) + "px");
    }, 
    function () {
      $("#kyodai_hover").css("left","-2000px");
    }
	);
}

/**
 * choose one block
 * @param {number} x The x.
 * @param {number} y The y.
 */ 
kyodai.choose = function(x, y)
{
  $("#kyodai_cuechoose").html("");
  kyodai.point = {x:x, y:y};
  $("#kyodai_choose").css("left",( x * 35) + "px");
  $("#kyodai_choose").css("top",(y * 35) + "px");
}

/**
 * unchoose one block
 */ 
kyodai.cancel = function()
{
  $("#kyodai_cuechoose").html("");
  kyodai.point = false;
  $("#kyodai_choose").css("left","-2000px");
}

/**
 * mouse click
 * @param {event} event mouse click event.
 */ 
kyodai.click = function(x,y)
{
  var ex = Math.ceil(x / 35);
  var ey = Math.ceil(y / 35);
  if (!kyodai.block[ex+","+ey]) return;
  kyodai.sound(2);
  if (!kyodai.point)
  {
    // click at the first time
    kyodai.choose(ex, ey);
    return;
  }
  var sx = kyodai.point.x;
  var sy = kyodai.point.y;
  var s = sx+","+sy;
  var e = ex+","+ey;
  if (s == e)
  {
    // click the same one twice
    kyodai.cancel();
    kyodai.combo = 0;
    kyodai.updatecombo();
    return;
  }
  var ss = kyodai.block[s];
  var ee = kyodai.block[e];
  if (ss != ee)
  {
    // choose unmatch
    kyodai.choose(ex, ey);
    kyodai.combo = 0;
    kyodai.updatecombo();
    return;
  }
  kyodai.cancel();
  kyodai.block[s] = 0;
  kyodai.block[e] = 0;
  var line = kyodai.find(sx, sy, ex, ey);
  if (!line)
  {
    // can't connect
    kyodai.block[s] = ss;
    kyodai.block[e] = ee;
    kyodai.combo = 0;
    kyodai.updatecombo();
    return;
  }
  if (ee < 4) kyodai.add(ee);
  $("#kyodai_lines").html(line.join(""));
  $("#kyodai_lines img").hide();
  $("#kyodai_lines img").fadeIn("fast");
  $("#kyodai_lines img").fadeOut("fast");
  kyodai.del(sx, sy, ex, ey);
}

/**
 * delete the chose pair
 */ 
kyodai.del = function(sx,sy,ex,ey)
{
  kyodai.sound(3);
  kyodai.remain -= 2;
  $("#kyodai_remain").html('Remain : ' + kyodai.remain);
  $("#Item_"+sx+"_"+sy).fadeOut("fast");
  $("#Item_"+ex+"_"+ey).fadeOut("fast");
  
  if(kyodai.counts > 270){
    kyodai.combo += 1;
    if(kyodai.combo > kyodai.highestcombo){
      kyodai.highestcombo = kyodai.combo;
    }
    kyodai.updatecombo();
    kyodai.scores += 1;
    $("#kyodai_scores").html('Scores : ' + kyodai.scores);
    $("#kyodai_update").html('+1!');
    $("#kyodai_update").fadeIn("normal");
    $("#kyodai_update").fadeOut("normal");
    
  }
  else{
    kyodai.combo = 0;
    kyodai.updatecombo();
  }
  
  kyodai.count();
  // win
  if (!kyodai.remain) setTimeout("kyodai.over('win')",600);
}

/**
 * update combo counts
 */
kyodai.updatecombo = function()
{
  switch (kyodai.highestcombo)
  {
    case 5 : $("#kyodai_combo").css("color","#66CC00"); $("#kyodai_board").css("color","#66CC00");
    break;
    case 10 : $("#kyodai_combo").css("color","#3399FF"); $("#kyodai_board").css("color","#3399FF");
    break;
    case 15 : $("#kyodai_combo").css("color","#9933FF"); $("#kyodai_board").css("color","#9933FF");
    break;
    case 20 : $("#kyodai_combo").css("color","#FF9933"); $("#kyodai_board").css("color","#FF9933");
    break;
    case 30 : $("#kyodai_combo").css("color","#FF0000"); $("#kyodai_board").css("color","#FF0000");
  }
  $("#kyodai_combo").html('Combo: ' + kyodai.combo + ' / ' + kyodai.highestcombo + ' Hits');
}

/**
 * count down
 */
kyodai.count = function()
{
  clearInterval(kyodai.timeid);
  $("#kyodai_count img").attr("src",kyodai.getCachedImage('count1.png'));
  $("#kyodai_count img").width(328);
  kyodai.counts = 328;
  kyodai.timeid = setInterval(function()
  {
    kyodai.counts -= 1;
    $("#kyodai_count img").width(kyodai.counts);
    switch (kyodai.counts)
    {
      // timing bar
      case 270 : $("#kyodai_count img").attr("src",kyodai.getCachedImage('count2.png'));
      break;
      case 180 : $("#kyodai_count img").attr("src",kyodai.getCachedImage('count3.png'));
      break;
      case 100 : $("#kyodai_count img").attr("src",kyodai.getCachedImage('count4.png'));
      break;
      case  65 : $("#kyodai_count img").attr("src",kyodai.getCachedImage('count5.png'));
      break;
      case  30 : $("#kyodai_count img").attr("src",kyodai.getCachedImage('count6.png'));
    }
    if (kyodai.counts < 2)
    {
      // Times up
      kyodai.over('gameover');
    }
  }
  , 80)
}

/**
 * random the arr
 */
kyodai.random = function(arr)
{
  var rnd = [];
  while (arr.length)
  {
    rnd=rnd.splice(0,Math.floor(Math.random()*(rnd.length+1))).concat(arr.splice(Math.floor(Math.random()*arr.length),1),rnd);
  }
  return rnd;
}

/**
 * add the toolkit
 */
kyodai.add = function(id)
{
  if (kyodai.pptnum[id])
  {
    $("#kyodai_ppt_"+id+"_num").attr("src",kyodai.getCachedImage('tool_num_'+ ++kyodai.pptnum[id] +'.png'));
  }
  else
  {
    kyodai.pptnum[id] = 1
    $("#kyodai_ppt").append('<img id=kyodai_ppt_'+id+' src="'+kyodai.getCachedImage('tool'+ id +'.png')+'">');
    $("#kyodai_ppt_num").append('<img id=kyodai_ppt_'+id+'_num src="'+kyodai.getCachedImage('tool_num_1.png')+'" onclick="kyodai.use('+id+')">');
  }
}

/**
 * use the toolkit
 */
kyodai.use = function(id)
{
  kyodai.sound(4);
  kyodai.cancel();
  if (--kyodai.pptnum[id])
  {
    $("#kyodai_ppt_"+id+"_num").attr("src",kyodai.getCachedImage('tool_num_'+ kyodai.pptnum[id] +'.png'));
  }
  else
  {
    $("#kyodai_ppt_"+id).remove();
    $("#kyodai_ppt_"+id+"_num").remove();
  }
  switch (id)
  {
    // suggest
    case 1 : kyodai.cue(false);
    break;
    // reset
    case 2 : kyodai.reset();
    break;
    // bomb
    case 3 : kyodai.cue(true);
  }
}

/**
 * Tookit cue
 */
kyodai.cue = function(isbomb)
{
  var s = kyodai.shape;
  var n = kyodai.pptnum[1];
  for (var i=0; i<s.length; i++)
  {
    n = kyodai.block[s[i].x+","+s[i].y];
    if (n)
    {
      for (var j=i+1; j<s.length; j++)
      {
        if (n == kyodai.block[s[j].x+","+s[j].y])
        {
          var sx = s[i].x;
          var sy = s[i].y;
          var ex = s[j].x;
          var ey = s[j].y;
          var line = kyodai.find(sx, sy, ex, ey);
          if (line)
          {
            $("#kyodai_cuechoose").html('<img src = "'+ kyodai.getCachedImage('choose.png') +'" style="position:absolute;left:'+ (sx*35) +'px;top:'+ sy*35 +'px">'
            + '<img src = "'+ kyodai.getCachedImage('choose.png') +'" style="position:absolute;left:'+ (ex*35) +'px;top:'+ ey*35 +'px">');
            $("#kyodai_lines").html(line.join(""));
            $("#kyodai_lines img").fadeOut(1000);
            $("#kyodai_cuechoose img").fadeOut(1000);
            if (isbomb)
            {
              $("#kyodai_cuechoose").text("");
              kyodai.block[sx+","+sy] = 0;
              kyodai.block[ex+","+ey] = 0;
              kyodai.del(sx, sy, ex, ey);
            }
            return
          }
        }
      }
    }
  }
}

/**
 * Reset the game
 */
kyodai.reset = function()
{
  var blocks = [];
  for (var i in kyodai.block)
  {
    blocks.push(kyodai.block[i]);
  }
  kyodai.setting(blocks);
}

/**
 * Background sonund
 */
kyodai.sound = function(id)
{
  try{
    au_sound.GotoFrame(0);
    au_sound.GotoFrame(id);
    au_sound.Play();
  }
  catch(err){}
}

/**
 * Game Over
 */
kyodai.over = function(type)
{
  kyodai.cancel();
  clearInterval(kyodai.timeid);
  $("#kyodai_count img").width(0);
  $("#kyodai_items").html("");
  $("#kyodai_ppt_num").html("");
  $("#kyodai_remain").html("");
  $("#kyodai_scores").html("");
  $("#kyodai_combo").html("");
  $("#kyodai_hover").css("left","-2000px");
  $("#kyodai_choose").css("left","-2000px");
  $("#kyodai_ppt").html('<img src ="'+ kyodai.getCachedImage('notool.png') +'">');
  document.onkeydown = null;

  if(type != 'win'){
    var basic = kyodai.scores;
    var props = 0;
    for (var i=1; i<6; i++){
      if(kyodai.pptnum[i]>0){
        props += kyodai.pptnum[i];
      }
    }
    kyodai.scores += kyodai.highestcombo*2 + props*5;
    $("#kyodai_center").css("display","block");
    $("#kyodai_center").html('<p class="centertitle">You Win!</p><div class="centerboard"><p>Basic Scores: ' + basic + ' x 1</p><p>Combo Bonus: ' + kyodai.highestcombo + ' x 2</p><p style="border-bottom:1px solid #FFF;">Props scores: ' + props + ' x 5</p><p>Total scores: ' + kyodai.scores + ' points </p></div><div id="centerbtn">New Game</div>');
    $("#centerbtn").click(function() {
		  kyodai.start();
	  });
  }
  else{
    $("#kyodai_center").css("display","block");
    $("#kyodai_center").html('<p class="centertitle" style="margin-top:50px;">Game Over</p><div id="centerbtn" style="margin-top:30px;">New Game</div>');
    $("#centerbtn").click(function() {
		  kyodai.start();
	  });
  }
}

/**
 * Game start
 */
kyodai.start = function()
{
  $("#kyodai_scores").html("");
  $("#kyodai_combo").html("");
  $("#kyodai_center").css("display","none");
  kyodai.sound(1);
  kyodai.cancel();
  kyodai.pptnum = {1:3, 2:3};
  // Tools images
  $("#kyodai_ppt").html('<img id=kyodai_ppt_1 src ="'+ kyodai.getCachedImage('tool1.png') +'">'+'<img id=kyodai_ppt_2 src ="'+ kyodai.getCachedImage('tool2.png') +'">');
  $("#kyodai_ppt_num").html('<img id=kyodai_ppt_1_num src ="'+ kyodai.getCachedImage('tool_num_3.png') +'">'+'<img id=kyodai_ppt_2_num src ="'+ kyodai.getCachedImage('tool_num_3.png') +'">');
    
  $("#kyodai_ppt_1_num").click(function() {
    kyodai.use(1);
  });
  $("#kyodai_ppt_2_num").click(function() {
    kyodai.use(2);
  });
  // shortcuts
  document.onkeydown = function()
  {
    if (event.keyCode==49 && kyodai.pptnum[1]) kyodai.use(1);
    if (event.keyCode==50 && kyodai.pptnum[2]) kyodai.use(2);
  };
  
  kyodai.scores = 0;
  kyodai.combo = 0;
  kyodai.highestcombo = 0;
  kyodai.counts = 0;
  kyodai.loadmap(Math.floor(Math.random()*kyodai.mapLength));
}