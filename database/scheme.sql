drop database if exists pafdb;

create database pafdb;

use pafdb;

create table user (
    user_id char(8) not null,
    username varchar(32) not null,
    name varchar(32) optional,

    primary key (user_id)
);

create table task (
    task_id int auto_increment,
    description varchar(255),
    priority int CHECK (priority<=3 and priority>=1),
    due_date date not null,

    primary key (task_id)
)
