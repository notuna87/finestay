package com.finestay.service;

import com.finestay.entity.Member;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;


@SpringBootTest
@Log4j2
class MemberServiceTest {

    @Autowired
    private MemberService memberService;

    @Test
    public void testupdate1(){
        Member member = new Member();
        member.setId(1L);
        member.setAge(25);
        member.setName("뚜뚜");
        member.setAddress("정왕동");
        memberService.register(member);
    }

    //CRUD -> read
    @Test
    public void testRead(){
        Long memberId = 1L;
        Member team = memberService.read(memberId);
        log.info("team : " + team);
    }

    @Test
    public void testReadAll(){
        List<Member> members = memberService.readAll();
        members.forEach(member -> log.info("member : " + member) );
    }

    //CRUD -> delete
    @Test
    public void testDelete(){
        Long memberId = 2L;
        memberService.delete(memberId);
    }

}