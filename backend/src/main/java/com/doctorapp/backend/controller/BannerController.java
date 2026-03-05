package com.doctorapp.backend.controller;

import com.doctorapp.backend.entity.Banner;
import com.doctorapp.backend.service.BannerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    // PUBLIC - anyone can get banners
    @GetMapping("/banners")
    public List<Banner> getAllBanners() {
        return bannerService.getAllBanners();
    }

    // ADMIN ONLY - add banner
    @PostMapping("/admin/banners")
    public Banner addBanner(@RequestBody Banner banner) {
        System.out.println("controller reached");
        Banner saved = bannerService.addBanner(banner);
        System.out.println("saved banner id = " + saved.getBannerId());
        return saved;
    }

    // ADMIN ONLY - delete banner
    @DeleteMapping("/admin/banners/{id}")
    public String deleteBanner(@PathVariable Integer id) {
        bannerService.deleteBanner(id);
        return "Banner deleted successfully";
    }
}