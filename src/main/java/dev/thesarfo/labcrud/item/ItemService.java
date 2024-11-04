package dev.thesarfo.labcrud.item;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Item save(Item item) {
        return itemRepository.save(item);
    }

    public List<Item> getItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(int id) {
        return itemRepository.findById(id).orElseThrow(() -> new RuntimeException("Item not found with id " + id));
    }

    public Item updateItem(int id, Item item) {
        Optional<Item> itemOptional = itemRepository.findById(id);

        if (itemOptional.isPresent()) {
            Item existingItem = itemOptional.get();
            existingItem.setName(item.getName());
            existingItem.setDescription(item.getDescription());
            existingItem.setPrice(item.getPrice());
            return itemRepository.save(existingItem);
        } else {
            throw new EntityNotFoundException("Item with id " + id + " not found");
        }
    }

    public ResponseEntity<Void> deleteItem(int id) {
        Optional<Item> itemOptional = itemRepository.findById(id);

        if (itemOptional.isPresent()) {
            itemRepository.delete(itemOptional.get());
        } else {
            throw new EntityNotFoundException("Item with id " + id + " not found");
        }
        return null;
    }


}
