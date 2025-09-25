package com.finestay.service;

import com.finestay.entity.Board;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
class BoardServiceTest {

    @Autowired
    private BoardService boardService;

    @Test
    public void testInsert() {
        Board board = new Board();
        board.setContent("안녕핫요~");
        board.setCreatedBy("system");
        boardService.register(board);
    }

    @Test
    public void testUpdate(){
        Board board = new Board();
        board.setId(1L);
        board.setCreatedBy("system");
        board.setContent("아뇽");
        boardService.register(board);
    }

    //CRUD -> read
    @Test
    public void testRead(){
        Long boardId = 1L;
        Board team = boardService.read(boardId);
        log.info("team : " + team);
    }

    @Test
    public void testReadAll(){
        List<Board> boards = boardService.readAll();
        boards.forEach(board -> log.info("board : " + board) );
    }

    //CRUD -> delete
    @Test
    public void testDelete(){
        Long boardId = 1L;
        boardService.delete(boardId);
    }

}