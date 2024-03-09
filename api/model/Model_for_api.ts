export interface UserPostRequest {
    email:   string;
    username: string;
    password:   string;
    type: string;
}

export interface UserPutRequest {
    uid : number;
    email:   string;
    username: string;
    password:   string;
    Newpassword : string;
    type: string;
    bio: string;
    user_image: string;
}

export interface UpdateImage {
    pid : number;
    uid : number;
    image : string;
    upload : Date;
    score : number;
    win : number;
    lose : number;
}

export interface UploadImage {
    image_url : string;
}

export interface Vote {
   uid : number;
}

export interface UpdateScore {
    lose_pid : number;
    R_score_win : number;
    R_score_lose : number;
 }
 export interface Movie {
    name : string;
    score : number;
    genre : string;
    poster : string;
    des : string;
 }

 export interface Person {
    name : string;
    age : number;
    detail : string;
    p_image : string;
 }

 export interface toStars{
    mids : number;
    pids : number;
 }

 export interface toCreators{
    midc : number;
    pidc : number;
 }

