import React, {useEffect} from 'react';

import './canvas.css'

function Canvas({configProps}) {

        const canvas =  document.createElement('canvas')
        canvas.classList='bg'
        const ctx       = canvas.getContext('2d') 

        let dots = [];
        let requestID;
        const mouse = {
            x: 0, 
            y: 0
        }
        let config = {
            dotsCounts:               50,
            bgColor:                  "#000",
            dotRadius:                1,
            maxSpeed:                 0.5,
            changeSpeed:              0.1,
            outOfBorderChangeSpeed:   5,
            maxLineLength:            window.innerHeight * 0.3,
            dotOpacitySpeed:          1,
            mouseRepulsion:           false,
            mouseRadius:              100,
        }
        config = {...config, ...configProps}
        
        resizeCNV();
        
        class DOT {
            constructor(){
                this.x              = Math.random() * canvas.width
                this.y              = Math.random() * canvas.height
                this.countLines     = 0
                this.opacity        = 100
     
    
                
                this.calculateStandartSpeed()
                this.createDot();
    
            }
    
            calculateStandartSpeed(){
                    this.standartSpeedX = this.speedX = Math.random() * 2 * config.maxSpeed - config.maxSpeed
                    this.standartSpeedY = this.speedY = Math.random() * 2 * config.maxSpeed - config.maxSpeed
            }
    
            calculateSpeed(){
                if(this.x < -10 * config.maxSpeed || this.y < -10 * config.maxSpeed)
                {
                    this.speedX += config.outOfBorderChangeSpeed
                    this.speedY += config.outOfBorderChangeSpeed
                }
                if(this.x > canvas.width + 10 * config.maxSpeed || this.y > canvas.height + 10 * config.maxSpeed )
                {
                    this.speedX -= config.outOfBorderChangeSpeed
                    this.speedY -= config.outOfBorderChangeSpeed
                }
                    
                this.speedX > this.standartSpeedX ? this.speedX -= config.changeSpeed : this.speedX += config.changeSpeed
                this.speedY > this.standartSpeedY ? this.speedY -= config.changeSpeed : this.speedY += config.changeSpeed
            }
    
            createDot()
            {
                
                this.color = `hsla(${this.x/canvas.width * 360}, 100%, 50%`        
                ctx.beginPath();
                ctx.arc(this.x, this.y, config.dotRadius, 0, Math.PI*2)
                ctx.closePath();
                if(this.countLines > 0)
                        ctx.fillStyle=this.color + `, ${this.opacity < 100 ? this.opacity += config.dotOpacitySpeed : this.opacity}%`;
                else    ctx.fillStyle=this.color + `, ${this.opacity > 0   ? this.opacity -= config.dotOpacitySpeed : this.opacity}%`;
                ctx.fill();
            }
    
            moveDot()
            {
                
                //mouse follow
                if(config.mouseRepulsion){
                    let length;
                    length = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2))
    
    
                    if(length < config.mouseRadius){
                    if((mouse.x - this.x > 0 && this.speedX > 0) || (mouse.x - this.x < 0 && this.speedX < 0)){
                        this.speedX *= -1;
                        this.standartSpeedX *= -1
                    }
                        
                    if((mouse.y - this.y > 0 && this.speedY > 0) || (mouse.y - this.y < 0 && this.speedY < 0)){
                        this.speedY *= -1;
                        this.standartSpeedY *= -1
                    }
                        
    
                        this.speedX > 0 ? this.speedX += (length / config.mouseRadius) / 10 : this.speedX -= (length / config.mouseRadius) / 10
                        this.speedY > 0 ? this.speedY += (length / config.mouseRadius) / 10 : this.speedY -= (length / config.mouseRadius) / 10
                        
                    }else(
                        this.calculateSpeed()
                    )
                } 
               
               //border screen
               if((this.x>=canvas.width && this.standartSpeedX > 0) || (this.x<=0 && this.standartSpeedX<0))
               this.standartSpeedX *= -1
               if((this.y>=canvas.height && this.standartSpeedY > 0)|| (this.y<=0 && this.standartSpeedY < 0))
               this.standartSpeedY *= -1
               
    
                    if(!config.mouseRepulsion)
                        this.calculateSpeed()
                this.x += this.speedX;
                this.y += this.speedY;
                this.createDot()
            }
    
        }


        function drawBG(){
            ctx.fillStyle=config.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        function resizeCNV(){
            canvas.width   = window.innerWidth;
            canvas.height  = window.innerHeight;
        }
        
    
        
    
        
    
    

   
        
    
        function initDots()
        {
            for(let i = 0; i<config.dotsCounts; i++)
            dots.push(new DOT)
        }
        initDots()
    
        function createLines()
        {
            let x1, x2, y1, y2, length;
    
            for(let i=0; i<config.dotsCounts; i++)
            {
                x1 = dots[i].x;
                y1 = dots[i].y;
                dots[i].countLines = -1
                for(let j=0; j<config.dotsCounts; j++)
                {
                    x2 = dots[j].x
                    y2 = dots[j].y
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    
                    if(length <= config.maxLineLength)
                    {
                        ctx.lineWidth   = '1';
                        const gradient = ctx.createLinearGradient(x1,y1, x2, y2);
                        gradient.addColorStop(0, dots[i].color + `, ${1 - (length/config.maxLineLength)})`);
                        gradient.addColorStop(1, dots[j].color + `, ${1 - (length/config.maxLineLength)})`);
                        ctx.strokeStyle = gradient
                        ctx.beginPath()
                        ctx.moveTo(x1, y1)
                        ctx.lineTo(x2, y2)
                        ctx.closePath();
                        ctx.stroke();
                        dots[i].countLines++
                        
                    }
                    
                }
            }
        }
    
        function loop(){
            drawBG();

            dots.forEach(item => item.moveDot())
            createLines()
            requestID = requestAnimationFrame(loop)
        }
    
        function mouseCoord(e){
            mouse.x = e.clientX;
            mouse.y = e.clientY
        }
        canvas.addEventListener("mousemove", mouseCoord);

    useEffect(()=>{
        document.querySelector('#root').appendChild(canvas)
        window.addEventListener('resize', resizeCNV);
        loop()
        return function cleanup() {
            document.querySelector('.bg').remove()
            cancelAnimationFrame(requestID)
            canvas.removeEventListener('mouseover', mouseCoord)
            window.removeEventListener('resize', resizeCNV)
          };
    },[config])


    return ( <></>
     );
}

export default Canvas;