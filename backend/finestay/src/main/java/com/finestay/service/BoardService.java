package com.finestay.service;

import com.finestay.entity.Board;
import com.finestay.repository.BoardRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;

    //CRUD => Crete
    public void register(Board board) {
        boardRepository.save(board);
    }

    //CRUD => Read
    public Board read(Long boardId){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found with id: " + boardId));
        return  board;
    }

    //CRUD => Read All
    public List<Board> readAll(){

        List<Board> boards = boardRepository.findAll();
        return boards;
    }

    //CRUD => delete
    public void delete(Long boardId){
        boardRepository.deleteById(boardId);
    }

    //paging
    public Page<Board> readAllPage(Pageable pageable){
        Page<Board> boardPage = boardRepository.findAll(pageable);
        return boardPage;
    }

}
