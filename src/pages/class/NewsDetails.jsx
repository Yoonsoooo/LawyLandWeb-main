import React from 'react'
import Util_ from './GlobalFtn'
import '../../stylesheets/news_details.css'
import Popup from './Popup'

export default function Create_news_details(num_,imgs_){
    console.log('news details')
    return class extends React.Component{
        constructor(){
            super()
            this.data_=DataInfo.get_page_memmory('ShowingContent').details
            //===for test=================
            this.data_.news_date="2021.06.10"
            this.data_.view_count="10"
            this.data_.sub_count="4"
            this.data_.dis_sub_count="0"
            //============================
            this.state={
                imgs:imgs_,
                sub_count:this.data_.sub_count,
                dis_sub_count:this.data_.dis_sub_count
            }
        }
        async action_sub_news(type_){
            var from_server_=await Util_.cli_to_server('/news/req_sub',{num:num_,type:type_,user:DataInfo.return_user_num()})
            if(from_server_.success){
                if(type_==0) this.state.sub_count+=1
                else this.state.sub_count+=1
                this.setState(this.state)
            }
            Popup.Create_popup(null,from_server_.message, '창닫기')
        }
        render(){
            return (
                <div id='news_details_back'>
                    <div id="news_details_container" className="inline_container">
                        <NewsDetails imgs={this.state.imgs}/>
                        <div id='news_details_comment'>
                            <div id='news_header_container'>
                                <div>{this.data_.title}</div>
                                <br/>
                                <div className="normal_text">{this.data_.proponent}</div>
                                <br/>
                                <div className="normal_text">{this.data_.up_date}</div>
                            </div>
                            <div id='news_additional_container' className='inline_container content_preshow_container'>
                                더 많은 카드뉴스를 원하시면
                                <div>인스타 주소</div>
                                <div>네이버 카페 주소</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

class NewsDetails extends React.Component{
    constructor(props){
        super(props)
        this.state={
            img_list_ele:null, 
            showing_img_src:this.props.imgs[0]
        }
        this.img_list=this.props.imgs
        this.clicked_img_index=0
    }
 
    map_img_controller(){
        this.state.img_list_ele= this.props.imgs.map((val_, index_)=>{
            return (
                <img key={index_} src={val_}/>
            )
        })
        console.log(this.state)
        this.setState(this.state)
    }
    componentDidMount(){
        this.map_img_controller()
    }
    render(){
        return(
            <div id='news_content_container'>
                <div id='news_img_list'>
                    {this.state.img_list_ele}
                </div>
            </div>
        )
    }
}