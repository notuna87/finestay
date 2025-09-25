package com.finestay.controller;

import com.finestay.entity.Member;
import com.finestay.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
@Log4j2
public class MemberController {

    private final MemberService memberService;

//    @GetMapping("/list")
//    public String list(Model model){
//        List<Member> members = memberService.readAll();
//        model.addAttribute("members", members);
//        log.info(members);
//        return "finestay/list";
//    }

    @GetMapping("/list")
    public String list2(@RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size, Model model) {
        Pageable pageable = (Pageable) PageRequest.of(page, size);
        Page<Member> memberPage = memberService.readAllPage(pageable);
        model.addAttribute("memberPage", memberPage);
        // return "list";
        return "finestay/list";
    }

    @GetMapping("/new")
    public String createForm(Model model){
        log.info("create.............");
        model.addAttribute("member", new Member());
        return "finestay/newForm";
    }

    @PostMapping("/new")
    public String create(@ModelAttribute("member") Member member){
        log.info("------------------------");
        memberService.register(member);
        return "redirect:list";
    }

    @GetMapping("/edit/{id}")
    public String updateForm(@PathVariable("id") String id, Model model){
        Long memberId = Long.parseLong(id);
        Member member = memberService.read(memberId);
        model.addAttribute("member", member);
        return "finestay/updateForm";
    }

    @PostMapping("/update")
    public String update(@ModelAttribute Member member){
        log.info("update..........." + member);
        memberService.register(member);
        return "redirect:list";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable("id") String id){
        Long memberId = Long.parseLong(id);
        memberService.delete(memberId);
        return "redirect:/member/list";
    }

}
