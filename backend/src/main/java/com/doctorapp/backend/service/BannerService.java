package com.doctorapp.backend.service;

import com.doctorapp.backend.entity.Banner;
import com.doctorapp.backend.repository.BannerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public Banner addBanner(Banner banner) {
        System.out.println("banner service touched");
        return bannerRepository.save(banner);
    }

    public void deleteBanner(Integer bannerId) {
        bannerRepository.deleteById(bannerId);
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }
}