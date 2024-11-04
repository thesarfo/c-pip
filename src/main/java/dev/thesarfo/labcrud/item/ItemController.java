package dev.thesarfo.labcrud.item;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items")
public class ItemController {

    private final ItemRepository itemRepository;
    private final ItemService itemService;

    @PostMapping
    public Item createItem(@RequestBody Item item) {
        return itemService.save(item);
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getItems();
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable int id) {
        return itemService.getItemById(id);
    }

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable int id, @RequestBody Item itemDetails) {
        return itemService.updateItem(id, itemDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable int id) {
        return itemService.deleteItem(id);
    }
}

